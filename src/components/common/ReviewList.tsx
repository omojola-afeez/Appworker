import { Star, MessageSquare, Calendar } from 'lucide-react';
import { Review, Profile } from '../../types/database.types';
import { Card } from './Card';

interface ReviewListProps {
  reviews: (Review & { reviewer?: Partial<Profile> })[];
}

export function ReviewList({ reviews }: ReviewListProps) {
  if (reviews.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-2xl border border-dashed border-gray-300">
        <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h4 className="text-lg font-bold text-gray-900 mb-1">No reviews yet</h4>
        <p className="text-gray-500">Reviews from past projects will appear here.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {reviews.map((review) => (
        <Card key={review.id} hoverEffect={false} className="border-gray-100 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center font-bold text-blue-600 border border-blue-100 uppercase">
                {review.reviewer?.full_name?.charAt(0)}
              </div>
              <div>
                <h4 className="font-bold text-gray-900 leading-tight">{review.reviewer?.full_name}</h4>
                <div className="flex items-center gap-1.5 mt-0.5 text-xs text-gray-500">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{new Date(review.created_at).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1 bg-yellow-50 px-3 py-1.5 rounded-lg border border-yellow-100">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="font-bold text-yellow-900 text-sm">{review.rating.toFixed(1)}</span>
            </div>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
            <p className="text-gray-700 text-sm leading-relaxed italic">"{review.comment}"</p>
          </div>
        </Card>
      ))}
    </div>
  );
}
