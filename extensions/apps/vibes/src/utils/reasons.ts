export type ReasonType = { title: string; description: string };

export const reasons: ReasonType[] = [
  {
    title: 'Threats of violence and incitement',
    description:
      'Content or actions that threaten, encourage, glorify or incite violence against anyone relate to extremism, terrorism, or human trafficking, directly or indirectly.',
  },
  {
    title: 'Hate Speech',
    description:
      'Content that promotes violence or hatred against people based on characteristics like race, ethnicity, national origin, caste, religion, disability, disease, age, sexual orientation, gender, or gender identity.',
  },
  {
    title: 'Bullying and harassment',
    description: 'Bullying and harassment',
  },
  {
    title: 'Sexual or human exploitation',
    description: 'Sexual or human exploitation',
  },
  {
    title: 'Impersonation',
    description: 'Impersonation',
  },
  {
    title: 'Illegal or certain regulated goods or services',
    description: 'Illegal or certain regulated goods or services',
  },
  {
    title: 'Privacy and copyright infringement',
    description: 'Privacy and copyright infringement',
  },
  {
    title: 'Spam and malicious links',
    description: 'Spam and malicious links',
  },
];

export const preSelectedReasons = ['Threats of violence and incitement', 'Bullying and harassment'];
