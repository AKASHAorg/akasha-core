import { TApplicationStatus } from './status-color';

export type TApplicationData = { status: TApplicationStatus; description: string; reason?: string };

const applicationData: TApplicationData[] = [
  {
    status: 'pending',
    description: "The admin is reviewing your application; you'll be notified of progress soon!",
  },
  {
    status: 'approved',
    description:
      'Congrats, your application was approved by the admin! You can start reviewing content now',
  },
  {
    status: 'rejected',
    description: "Sorry, your application wasn't approved for the following reason:",
    reason:
      'You were reported multiple times by others for the reason of spam links and impersonation',
  },
  {
    status: 'withdrawn',
    description: 'You have withdrawn your application',
  },
];

export const generateApplicationData = () =>
  applicationData[Math.floor(Math.random() * applicationData.length)];
