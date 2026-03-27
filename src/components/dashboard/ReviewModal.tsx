import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Modal } from '../common/Modal';
import { ReviewForm } from '../common/ReviewForm';
import { ReviewList } from '../common/ReviewList';
import { Review, Profile } from '../../types/database.types';

interface ReviewModalProps {
  bookingId: string;
  reviewerId: string;
  revieweeId: string;
  revieweeName: string;
  onClose: () => void;
  onSuccess: () => void;
}

export function ReviewModal({
  bookingId,
  reviewerId,
  revieweeId,
  revieweeName,
  onClose,
  onSuccess,
}: ReviewModalProps) {
  const [loading, setLoading] = useState(false);
  const [fetchingReviews, setFetchingReviews] = useState(true);
  const [existingReviews, setExistingReviews] = useState<(Review & { reviewer?: Partial<Profile> })[]>([]);
  const [hasUserReviewed, setHasUserUserReviewed] = useState(false);

  useEffect(() => {
    fetchReviews();
  }, [bookingId]);

  const fetchReviews = async () => {
    setFetchingReviews(true);
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select(`
          *,
          reviewer:profiles!reviews_reviewer_id_fkey(full_name)
        `)
        .eq('booking_id', bookingId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setExistingReviews(data || []);
      setHasUserUserReviewed(data?.some((r: any) => r.reviewer_id === reviewerId) || false);
    } catch (err) {
      console.error('Error fetching reviews:', err);
    } finally {
      setFetchingReviews(false);
    }
  };

  const handleSubmitReview = async (rating: number, comment: string) => {
    setLoading(true);
    try {
      // 1. Insert the review
      const { error: reviewError } = await supabase.from('reviews').insert({
        booking_id: bookingId,
        reviewer_id: reviewerId,
        reviewee_id: revieweeId,
        rating,
        comment,
      });

      if (reviewError) throw reviewError;

      // 2. Update the apprentice profile stats if the reviewee is an apprentice
      const { data: apprenticeProfile } = await supabase
        .from('apprentice_profiles')
        .select('rating, total_reviews, total_jobs')
        .eq('user_id', revieweeId)
        .maybeSingle();

      if (apprenticeProfile) {
        const newTotalReviews = apprenticeProfile.total_reviews + 1;
        const newRating = (apprenticeProfile.rating * apprenticeProfile.total_reviews + rating) / newTotalReviews;

        await supabase
          .from('apprentice_profiles')
          .update({
            rating: newRating,
            total_reviews: newTotalReviews,
            total_jobs: apprenticeProfile.total_jobs + 1,
          })
          .eq('user_id', revieweeId);
      }

      await fetchReviews();
      onSuccess();
    } catch (err) {
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal title={`Reviews for ${revieweeName}`} onClose={onClose} size="2xl">
      <div className="p-8 space-y-10">
        {!hasUserReviewed && (
          <section>
            <ReviewForm 
              revieweeName={revieweeName} 
              onSubmit={handleSubmitReview}
              isLoading={loading}
            />
          </section>
        )}

        <section>
          <div className="flex items-center justify-between mb-6">
            <h4 className="text-xl font-extrabold text-gray-900 uppercase tracking-wider">Project History</h4>
            <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-bold uppercase">
              {existingReviews.length} {existingReviews.length === 1 ? 'Review' : 'Reviews'}
            </span>
          </div>
          
          {fetchingReviews ? (
            <div className="flex justify-center py-10">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-600 border-t-transparent"></div>
            </div>
          ) : (
            <ReviewList reviews={existingReviews} />
          )}
        </section>
      </div>
    </Modal>
  );
}
