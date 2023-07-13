export const createDummyPosts =
  (count: number) =>
  ({ pageParam = 0 }) => {
    const content = [
      {
        type: 'paragraph',
        value:
          "Odds are you've heard about the Ethereum blockchain, whether or not you know what it is. It's been in the news a lot lately, including the cover of some major magazines, but reading those articles can be like gibberish if you don't have a foundation for what exactly Ethereum is. So what is it? In essence, a public database that keeps a permanent record of digital transactions. Importantly, this database doesn't require any central authority to maintain and secure it. Instead it operates as a “trustless” transactional system — a framework in which individuals can make peer-to-peer transactions without needing to trust a third party OR one another.",
      },
      {
        type: 'paragraph',
        value:
          "Still confused? That's where this post comes in.My aim is to explain how Ethereum functions at a technical level, without complex math or scary- looking formulas.Even if you're not a programmer, I hope you'll walk away with at least better grasp of the tech.If some parts are too technical and difficult to grok, that's totally fine! There's really no need to understand every little detail.I recommend just focusing on understanding things at a broad level",
      },
      {
        type: 'paragraph',
        value:
          "Many of the topics covered in this post are a breakdown of the concepts discussed in the yellow paper.I've added my own explanations and diagrams to make understanding Ethereum easier.Those brave enough to take on the technical challenge can also read the Ethereum yellow paper.",
      },
      {
        type: 'paragraph',
        value:
          "Many of the topics covered in this post are a breakdown of the concepts discussed in the yellow paper.I've added my own explanations and diagrams to make understanding Ethereum easier.Those brave enough to take on the technical challenge can also read the Ethereum yellow paper.",
      },
    ];
    return Array.from({ length: count }, (_, i) => ({
      id: `${pageParam}_${Math.floor(Math.random() * 100)}`,
      content,
    }));
  };
