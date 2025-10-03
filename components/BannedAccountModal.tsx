"use client";

import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { AlertTriangle, Mail, Send } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface BannedAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  userEmail: string;
  accountStatus: 'banned' | 'deleted';
}

export default function BannedAccountModal({ 
  isOpen, 
  onClose, 
  userEmail, 
  accountStatus 
}: BannedAccountModalProps) {
  const [appealData, setAppealData] = useState({
    name: '',
    email: userEmail,
    phone: '',
    reason: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!appealData.name || !appealData.email || !appealData.message) {
      toast.error('Please fill in all required fields');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/admin/appeal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...appealData,
          accountStatus,
          submittedAt: new Date().toISOString()
        }),
      });

      if (response.ok) {
        toast.success('Appeal submitted successfully! We will review your request within 24-48 hours.');
        onClose();
        setAppealData({
          name: '',
          email: userEmail,
          phone: '',
          reason: '',
          message: ''
        });
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || 'Failed to submit appeal');
      }
    } catch (error) {
      console.error('Appeal submission error:', error);
      toast.error('Failed to submit appeal. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setAppealData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center space-x-2">
            <AlertTriangle className="h-6 w-6 text-red-600" />
            <DialogTitle className="text-red-800">
              Account {accountStatus === 'banned' ? 'Banned' : 'Deleted'}
            </DialogTitle>
          </div>
          <DialogDescription>
            Your account has been {accountStatus === 'banned' ? 'temporarily banned' : 'deleted'} by the administrator. 
            {accountStatus === 'banned' 
              ? ' You can submit an appeal to request account restoration.' 
              : ' You can request account recovery by submitting an appeal.'
            }
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Full Name *</Label>
            <Input
              id="name"
              value={appealData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="Enter your full name"
              required
            />
          </div>

          <div>
            <Label htmlFor="email">Email Address *</Label>
            <Input
              id="email"
              type="email"
              value={appealData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              placeholder="Enter your email address"
              required
            />
          </div>

          <div>
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              value={appealData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              placeholder="Enter your phone number (optional)"
            />
          </div>

          <div>
            <Label htmlFor="reason">Reason for Appeal</Label>
            <Input
              id="reason"
              value={appealData.reason}
              onChange={(e) => handleInputChange('reason', e.target.value)}
              placeholder="Brief reason (e.g., Misunderstanding, Account Error)"
            />
          </div>

          <div>
            <Label htmlFor="message">Detailed Message *</Label>
            <Textarea
              id="message"
              value={appealData.message}
              onChange={(e) => handleInputChange('message', e.target.value)}
              placeholder="Please explain why your account should be restored. Provide any relevant details that might help with the review."
              rows={4}
              required
            />
          </div>

          <DialogFooter className="flex-col space-y-2">
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? (
                'Submitting Appeal...'
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Submit Appeal
                </>
              )}
            </Button>
            <Button type="button" variant="outline" onClick={onClose} className="w-full">
              Cancel
            </Button>
          </DialogFooter>
        </form>

        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
          <div className="flex items-start space-x-2">
            <Mail className="h-4 w-4 text-blue-600 mt-0.5" />
            <div className="text-sm text-blue-800">
              <p className="font-medium">What happens next?</p>
              <ul className="mt-1 space-y-1 text-xs">
                <li>• Your appeal will be reviewed by our admin team</li>
                <li>• You'll receive a response within 24-48 hours</li>
                <li>• Check your email for updates on your appeal status</li>
              </ul>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}