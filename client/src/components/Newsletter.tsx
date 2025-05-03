import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      toast({
        title: "Error",
        description: "Please enter your email address",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Success!",
        description: "You've been subscribed to our newsletter.",
      });
      setEmail('');
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <div className="bg-gradient-to-r from-blue-600 to-violet-600 rounded-lg shadow-md p-6 text-white">
      <h3 className="text-lg font-bold mb-2">Subscribe to Newsletter</h3>
      <p className="text-blue-100 mb-4 text-sm">
        Get the latest articles and updates delivered to your inbox.
      </p>
      <form className="space-y-2" onSubmit={handleSubmit}>
        <Input
          type="email"
          placeholder="Your email address"
          className="bg-white text-gray-900 placeholder:text-gray-500 border-transparent"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Button 
          type="submit" 
          className="w-full bg-white text-blue-600 hover:bg-blue-50"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Subscribing...' : 'Subscribe'}
        </Button>
      </form>
    </div>
  );
}
