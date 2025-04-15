
import React from 'react';
import { CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface ClientLoginFormProps {
  rollNumber: string;
  setRollNumber: (value: string) => void;
  phoneNumber: string;
  setPhoneNumber: (value: string) => void;
}

const ClientLoginForm: React.FC<ClientLoginFormProps> = ({
  rollNumber,
  setRollNumber,
  phoneNumber,
  setPhoneNumber
}) => {
  return (
    <CardContent className="space-y-4 pt-4">
      <div className="space-y-2">
        <Label htmlFor="rollNumber">Roll Number</Label>
        <Input 
          id="rollNumber"
          placeholder="Enter your roll number"
          value={rollNumber}
          onChange={(e) => setRollNumber(e.target.value)}
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="phoneNumber">Phone Number</Label>
        <Input 
          id="phoneNumber"
          placeholder="Enter your phone number"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          required
        />
      </div>
    </CardContent>
  );
};

export default ClientLoginForm;
