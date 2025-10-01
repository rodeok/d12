"use client";

import { useState } from 'react';
import CalendarView from '@/components/CalendarView';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Mail, Phone, MapPin, Calendar as CalendarIcon, DollarSign } from 'lucide-react';

interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  allDay: boolean;
  resource: {
    tenant: any;
    property: any;
    status: 'active' | 'expiring' | 'expired';
    daysUntilExpiry: number;
  };
  color: string;
}

export default function CalendarPage() {
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);

  const handleEventSelect = (event: CalendarEvent) => {
    setSelectedEvent(event);
  };

  const sendReminder = async (type: 'email' | 'sms') => {
    if (!selectedEvent) return;

    try {
      const { tenant, property, daysUntilExpiry } = selectedEvent.resource;
      
      const subject = `Rent Expiry Reminder - ${property.title}`;
      const message = `
        <h2>Rent Expiry Reminder</h2>
        <p>Dear ${tenant.name},</p>
        <p>This is a reminder that your rent for <strong>${property.title}</strong> located at <strong>${property.address}</strong> ${
          daysUntilExpiry > 0 
            ? `will expire in ${daysUntilExpiry} days.` 
            : `has expired ${Math.abs(daysUntilExpiry)} days ago.`
        }</p>
        <p>Please ensure to renew your rent agreement on time.</p>
        <p>Best regards,<br/>Property Management</p>
      `;

      const response = await fetch('/api/notifications/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: type === 'email' ? tenant.email : tenant.phone,
          subject,
          html: message,
          type,
        }),
      });

      if (response.ok) {
        alert(`${type === 'email' ? 'Email' : 'SMS'} reminder sent successfully!`);
      }
    } catch (error) {
      alert('Failed to send reminder');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Calendar</h1>
        <p className="text-gray-600">Track rent expiry dates and manage renewals</p>
      </div>

      <CalendarView onEventSelect={handleEventSelect} />

      {/* Event Details Dialog */}
      <Dialog open={!!selectedEvent} onOpenChange={() => setSelectedEvent(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Rent Expiry Details</DialogTitle>
          </DialogHeader>
          
          {selectedEvent && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">{selectedEvent.resource.tenant.name}</h3>
                <Badge 
                  variant={
                    selectedEvent.resource.status === 'expired' ? 'destructive' : 
                    selectedEvent.resource.status === 'expiring' ? 'secondary' : 'default'
                  }
                >
                  {selectedEvent.resource.status}
                </Badge>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center text-sm">
                  <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                  <div>
                    <p className="font-medium">{selectedEvent.resource.property.title}</p>
                    <p className="text-gray-600">{selectedEvent.resource.property.address}</p>
                  </div>
                </div>
                
                <div className="flex items-center text-sm">
                  <Mail className="h-4 w-4 mr-2 text-gray-500" />
                  <span>{selectedEvent.resource.tenant.email}</span>
                </div>
                
                <div className="flex items-center text-sm">
                  <Phone className="h-4 w-4 mr-2 text-gray-500" />
                  <span>{selectedEvent.resource.tenant.phone}</span>
                </div>
                
                <div className="flex items-center text-sm">
                  <CalendarIcon className="h-4 w-4 mr-2 text-gray-500" />
                  <span>
                    {selectedEvent.resource.daysUntilExpiry > 0 
                      ? `Expires in ${selectedEvent.resource.daysUntilExpiry} days` 
                      : `Expired ${Math.abs(selectedEvent.resource.daysUntilExpiry)} days ago`
                    }
                  </span>
                </div>
                
                <div className="flex items-center text-sm">
                  <DollarSign className="h-4 w-4 mr-2 text-gray-500" />
                  <span>₦{selectedEvent.resource.tenant.rentAmount.toLocaleString()}/month</span>
                </div>
              </div>
              
              <div className="border-t pt-4">
                <p className="text-sm font-medium mb-3">Send Reminder</p>
                <div className="flex space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => sendReminder('email')}
                    className="flex-1"
                  >
                    <Mail className="h-4 w-4 mr-1" />
                    Email
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => sendReminder('sms')}
                    className="flex-1"
                  >
                    <Phone className="h-4 w-4 mr-1" />
                    SMS
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}