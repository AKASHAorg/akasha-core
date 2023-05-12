import { CHECK_APPLICATION_STATUS, HOME, MODIFY_APPLICATION } from '../routes';

export const BMIntroSubtitles = [
  {
    label:
      'Becoming a moderator means that you will be responsible to protect the community from harmful contents that violate our',
  },
  {
    label: 'Code of Conduct',
    link: '/code-of-conduct',
  },
  {
    label:
      'Make sure that you have fully understood our values and our code of conduct before applying!',
  },
];

export const BMConfirmationSubtitles = [
  {
    label:
      'Your application will be reviewed by the admin and you will receive feedback shortly. To check your application status, you can click',
  },
  {
    label: 'here',
    link: CHECK_APPLICATION_STATUS,
  },
  {
    label: 'or by visiting the',
  },
  {
    label: 'moderation overview',
    link: HOME,
  },
  { label: 'page' },
];

export const applicationUnderReviewSubtitles = [
  {
    label:
      'The admin is still reviewing your application it could take up to x days for the application to be reviewed. Meanwhile you can still',
  },
  {
    label: 'modify',
    link: MODIFY_APPLICATION,
  },
  {
    label: 'your application or',
  },
  {
    label: 'withdraw',
    link: MODIFY_APPLICATION,
  },
  { label: "it if you don't want to become a moderator." },
];

export const applicationApprovedSubtitles = [
  {
    label:
      "Congratulations ✨ you are officially a moderator! To start your journey, you can read AKASHA's",
  },
  { label: 'Moderation Guide', link: HOME },
  { label: 'and' },
  { label: 'FAQs', link: HOME },
];

export const applicationRejectedSubtitles = [
  {
    label:
      'After a careful review the admin have rejected your application for the following reasons:',
  },
];
