import { useState } from 'react';
import { Star, MessageSquare, Send } from 'lucide-react';
import { Button } from './Button';

interface ReviewFormProps {
  revieweeName: string;
  onSubmit: (rating: number, comment: string) => Promise<void>;
  isLoading?: boolean;
}

export function ReviewForm({
  revieweeName,
  onSubmit,
  isLoading = false,
}: ReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (rating === 0) {
      setError('Please select a rating');
      return;
    }

    try {
      await onSubmit(rating, comment);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit review');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-10 p-8 bg-white rounded-3xl shadow-sm border border-gray-100">
      <div className="text-center">
        <h4 className="text-2xl font-extrabold text-gray-900 mb-2">Rate your experience</h4>
        <p className="text-gray-500 font-medium text-lg">How was your collaboration with <span className="text-blue-600 font-bold">{revieweeName}</span>?</p>
      </div>

      <div className="flex flex-col items-center gap-6">
        <div className="flex justify-center gap-4">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHover(star)}
              onMouseLeave={() => setHover(0)}
              className="focus:outline-none transition-transform hover:scale-125 transform active:scale-95 p-1"
            >
              <Star
                className={`w-14 h-14 ${
                  star <= (hover || rating)
                    ? 'fill-yellow-400 text-yellow-400 drop-shadow-sm'
                    : 'text-gray-200'
                } transition-colors duration-200`}
              />
            </button>
          ))}
        </div>
        <div className="h-8 flex items-center justify-center">
          {rating > 0 && (
            <span className="text-lg font-extrabold text-gray-700 uppercase tracking-widest animate-pulse">
              {['Poor', 'Fair', 'Good', 'Very Good', 'Excellent'][rating - 1]}
            </span>
          )}
        </div>
      </div>

      <div className="space-y-4">
        <label htmlFor="comment" className="block text-sm font-bold text-gray-700 uppercase tracking-wider">
          Share your feedback (Optional)
        </label>
        <div className="relative">
          <div className="absolute top-4 left-4 text-gray-400">
            <MessageSquare className="w-6 h-6" />
          </div>
          <textarea
            id="comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={5}
            className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all outline-none resize-none text-lg leading-relaxed placeholder:text-gray-300"
            placeholder="What did you like? What could be improved?"
          />
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-2xl text-sm font-bold flex items-center gap-3">
          <div className="w-2 h-2 bg-red-600 rounded-full"></div>
          {error}
        </div>
      )}

      <Button
        type="submit"
        isLoading={isLoading}
        fullWidth
        size="lg"
        className="py-5 text-xl font-extrabold shadow-xl shadow-blue-100 gap-3"
      >
        <Send className="w-6 h-6" /> Submit Review
      </Button>
    </form>
  );
}
