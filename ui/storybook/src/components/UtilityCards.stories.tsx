/* eslint-disable import/first */
import DS from '@akashaproject/design-system';
import { action } from '@storybook/addon-actions';
import { text } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react';
import * as React from 'react';

const { Box, FilterCard, SwitchCard, ProfileAvatarButton, ViewportSizeProvider, MdCard } = DS;

export interface SwitchCardComponent {
  count: number;
  countLabel: string;
  buttonLabels: string[];
  buttonValues: string[];
  onIconClick: () => void;
}

const SwitchCardComponent: React.FC<SwitchCardComponent> = props => {
  const { count, countLabel, buttonLabels, buttonValues, onIconClick } = props;
  const [activeButton, setActiveButton] = React.useState<string>('All');

  const onTabClick = (value: string) => {
    setActiveButton(buttonValues[buttonLabels.indexOf(value)]);
  };

  return (
    <SwitchCard
      count={count}
      hasIcon={true}
      countLabel={countLabel}
      activeButton={activeButton}
      buttonLabels={buttonLabels}
      buttonValues={buttonValues}
      hasMobileDesign={true}
      onIconClick={onIconClick}
      onTabClick={onTabClick}
      loggedEthAddress={'0x000'}
    />
  );
};

storiesOf('Cards/Utility Cards', module)
  .add('filter card', () => (
    <Box align="center" pad={{ top: '40px' }} height="600px">
      <ViewportSizeProvider>
        <FilterCard
          titleElement={
            <ProfileAvatarButton
              avatarImage="https://placebeard.it/360x360"
              onClick={() => action('Avatar Button Click')()}
              label="@ivacarter"
              info="ivacarter.akasha.eth"
              size="sm"
              ethAddress={'0x000000'}
            />
          }
          handleClickAll={() => action('click all')('Synthetic Event')}
          handleClickFollowing={() => action('click following')('Synthetic Event')}
          handleClickLatest={() => action('click latest')('Synthetic Event')}
          handleClickOldest={() => action('click oldest')('Synthetic Event')}
        />
      </ViewportSizeProvider>
    </Box>
  ))
  .add('switch card', () => (
    <Box align="center" pad={{ top: '40px' }}>
      <SwitchCardComponent
        count={1276}
        countLabel={text('Count Label', 'results')}
        buttonLabels={[
          text('All Label', 'All'),
          text('Posts label', 'Posts'),
          text('Topics Label', 'Topics'),
          text('People Label', 'People'),
        ]}
        buttonValues={['All', 'Posts', 'Topics', 'People']}
        onIconClick={() => action('click icon')('Synthetic Event')}
      />
    </Box>
  ))
  .add('markdown card', () => (
    <Box align="center" pad={{ top: '40px' }} width="582px">
      <MdCard
        mdText={`
# Ethereum World Privacy policy


This Privacy Policy describes how we collect, use, store and share personal information about you when you interact with Ethereum World and the AKASHA social microblogging app on Ethereum World (the “**App**”). You have rights and choices regarding the information you provide to us that we explain to you.

The Privacy Policy applies to all information collected or submitted on the App and the related website, any of the features of this App, including but not limited to software and other downloads provided on this App and all of its mobile sub-sites. The Privacy Policy does not apply, however, to any plug-ins and links on the App including the related sites offering additional functionalities that may be available on the App. Such plug-ins and links are subject to separate privacy terms and terms of use.

Please read the Privacy Policy carefully before you start to use our App. 

## 1. Who are we?

The Ethereum World Association is the legal entity representing Ethereum World and the related App. The Association has been established in Switzerland and is governed by its members, which are globally distributed participants and contributors to Ethereum World.

If you have questions, concerns or suggestions for improvements regarding this Privacy Policy please feel free to contact us at <support@ethereum.world>.

## 2 Our values

We believe that humans are not problems waiting to be solved, but potential waiting to unfold. This requires **openness**, not hiding a bunch of surveillance tools under the rug. We nurture projects helping individuals unlock their potential through open systems. This demands to respect your **privacy** **and autonomy** over your own data and the technology and structure underlying our App, which has been built with these values in mind. However, this remains a work in progress. We are open for critique, feedback or any question you may have. 

## 3 Applicable data privacy laws

Your rights depend on the applicable data protection law. You may have further rights than set forth in this Privacy Policy or certain rights may not be accessible to you. 

We observe the statutory provisions of the Federal Act on Data Protection (“**DPA**”), the Ordinance to the Federal Act on Data Protection (“**ODPA**”), the Federal Telecommunications Act (“**TCA**”) and other applicable data protection provisions of Swiss and international law, in particular where applicable EU law. 

## 4 What data do we receive and process about you?

### 4.1 Data our servers process when you visit the App

When you visit our App, our servers temporarily store each access in a log file, as in principle with every download or access of an app:

*   the IP address of the requesting device,
*   the operating system version of your device, 
*   the configuration of the App when using our services,
*   name of the IP address range and name of the device,
*   the date and time of your use of our services,
*   and potentially additional statistical information.

This is the essential technical data we need to provide you with access to the Website. The data is collected without your intervention and stored by us until the daily automated compression & deletion. 

The collection and processing of these data are carried out for the purpose of enabling the use of our App (establishing a connection), ensuring system security and stability over the long term and optimising our internet presence as well as for internal statistical purposes. It is within our legitimate interest to process such data to offer you a well-functioning App.

The IP address will also be used together with the other data in the event of attacks on the network infrastructure or other unauthorised or abusive use of the App to identify offenders in connection with civil or criminal proceedings. The processing of this data is in our legitimate interest to track your visit to our App and to improve the App accordingly.

### 4.2 Is personal data automatically collected?

When using our App, we automatically collect certain data required to ensure the usability of the App. In particular:

*   the internal ID of your device;
*   the version of your operating system;
*   the time of access.

The collection and processing of this data is carried out for the purpose of enabling the use of our App (establishing a connection), ensuring system security and stability over the long term and ensuring a customer friendly use of our App as well as internal statistical purposes. The processing of this personal data is within our legitimate interest.

The internal ID of your device may also be evaluated together with other data in the event of attacks on the network infrastructure or other unauthorised or abusive use of our App for the purpose of clarification and defence and, if necessary, used within the framework of criminal proceedings for identification and for civil and criminal action against the users concerned. The processing of this information is in our legitimate interest.

### 4.3 Contacting us

When you contact us by email or other means of communication that we provide on the App (e.g. contact form), we collect and process information about you, such as your email address, your name or the content of your message. We use this data solely in connection with answering the queries we receive. The processing of this data is therefore in our legitimate interest to provide you with an answer to your query in the best possible and personalised way.

### 4.4 Creating an Ethereum World profile

You can create a profile on the Ethereum World website by simply connecting your Ethereum address to our decentralized infrastructure. The Ethereum World profile will allow you to access our App.

We use this data as well as additional information voluntarily provided by you or data derived from these data only in order to offer you access to the App and the option to use it. The processing of this data is necessary for us to perform our contractual obligations arising from this agreement with you.

### 4.5 Creating an Ethereum World ENS subdomain or connecting your existing ENS name

In addition to your Ethereum address, you can also connect your ENS name to associate your Ethereum address with your Ethereum World profile. If you do not already have an ENS name, you have the possibility to create an Ethereum World ENS subdomain or you can link any other ENS name you control on the Ethereum World website.

We use this data as well as additional information voluntarily provided by you or data derived from these data only in order to offer you access to the Ethereum World website and subsequently to the App. 

Please note, that visitors to the Ethereum World website can find your ENS names as well as other information linked to your ENS names, for example information you share via the App, in the search function that is offered on the Ethereum World website. This happens independently of where you have created your ENS name. The processing of this data is necessary for us to perform our contractual obligations arising from this agreement with you.

### 4.6 Accessing the App with your Ethereum World profile or your ENS name

You can access our App by using your Ethereum World profile or your ENS name. 

The data linked to your Ethereum World profile or your ENS name as well as additional information voluntarily provided by you or data derived from these data is used only in order to offer you access to the App and enable you to authenticate yourself when you log in. The processing of this data is necessary for us to perform our contractual obligations arising from this agreement with you.

We use voluntary information to display on the App according to the settings you have made and to make it available to other users of the App at your request. The processing of this personal data is therefore necessary for us to fulfil our pre-contractual and contractual obligations.

### 4.7 What personal data do we collect when you are using the App?

All information you add to Ethereum World is controlled and authorized by you through your cryptographic signatures related to your Ethereum address. The Ethereum World Association has no direct access to your data storage related to Ethereum World. When using the App, you can enter, manage and edit various information, tasks and activities. In particular, this information includes personal data that you provide (such as name, content of a post shared by you, comments or replies to threads, information about reposts, photos, information about who you follow and who follows you as well as information you added on the “about me” section) and information about events, friends, location data or likes that you include in your post or via interfaces.

For this the App may require the following permissions:

*   Internet access: This is required in order to save your entries.
*   Camera access: This is required to take photos of your documents and store them in the App.

The processing of this data is necessary for the fulfilment of pre-contractual and contractual obligations as well as for the use of the App.

## 5. Who are our third-party providers?

### 5. 1 Sub-processors

We use sub-processors for technical data processing and/ or service offerings such as to improve the accessibility (establishing a connection) and user experience of our services and ensuring system security and stability over the long term. 


* **Textile Hub**
1. *Purpose:* Data storage
1. *Lawful basis:* Legitimate interest to offer a well-functioning App
1. *Entity Country:* USA
1. *Personal data collected:* User media files
1. [Link](https://textile.io/)

* **Pinata**
1. *Purpose:* content delivery network (CDN) for IPFS related content
1. *Lawful basis:* Legitimate interest to offer a well-functioning App	
1. *Entity Country:* USA
1. *Personal data collected* User media files & Log data about events on the network
1. [Link](https://pinata.cloud/privacy)

* **Infura**
1. *Purpose:* Ethereum & IPFS Gateway APIs
1. *Lawful basis:* Legitimate interest to offer a well-functioning App
1. *Entity Country:* USA
1. *Personal data collected:* Ethereum Account addresses; Transaction information
1. [Link](https://infura.io/)
> **Note:** To improve your privacy and make the Ethereum network more resilient you may operate your own [Ethereum node](https://ethereum.org/en/developers/docs/nodes-and-clients/). 

* **Cloudflare**
1. *Purpose:* content delivery network (CDN), web application firewall (WAF) and domain name server (DNS) registry, Web traffic analytics	
1. *Lawful basis:* Legitimate interest to offer a well-functioning App	
1. *Entity Country:* USA
1. *Personal data collected:* Log data about events on the network such as information about visitors to and/or authorised users of our domain; networks; APIs.
1. [Link](https://www.cloudflare.com/en-gb/gdpr/introduction/)

* **Algolia**
1. *Purpose:* Web Search index
1. *Lawful basis:* Legitimate interest to offer a well-functioning App
1. *Entity Country:* USA / France
1. *Personal data collected:* Data resulting out of the hosting, indexing services provided such as Connection information; personal identifiers linked to the index; Equipment information.
1. [Link](https://www.algolia.com/policies/privacy/)


**5.2 Other third-party services that may receive your data**

We use third party services for instance to improve the user experience of our services and to keep you up to date via newsletters. We may also refer through Web links to other social media platforms on our App. We cannot influence what data these platforms process. Therefore, we recommend that you check their respective privacy policies before accessing these social media platforms. The following third-party services which may collect personal data are currently used on our App:

* **Matomo & Matomo Cloud (InnoCraft)**
1. *Purpose of processing:* Measuring the effectiveness of our App
1. *Lawful basis:* Explicit consent
1. *Data location and security:* Frankfurt, Germany
1. *Personal data collected by third party:*
Matomo uses Java Script trackers embedded in the code of our Websites and can place Cookies on your device. 

    Through Matomo we may collect the following data:
    - anonymized data for IP address;
    - pseudonyous User IDs;

    User analytics include:
    - IP address;
    - User ID;
    - Custom Dimensions;
    - Custom Variables;
    - Location of the user;
    - Date and time (including local timezone);
    - Title of the page being viewed;
    - URL of the page being viewed;
    - URL of the page that was viewed prior to the current page;
    - Screen resolution;
    - Files that were clicked and downloaded;
    - Link clicks to an outside domain;
    - Pages generation time;
    - Country, region, city;
    - Main Language of the browser;
    - User Agent of the browser.

*Privacy policies:* [Link](https://matomo.org/privacy-policy/); [Link](https://matomo.org/matomo-cloud-privacy-policy/)
    
* **Discord, Facebook, GitHub, Twitter, Reddit, YouTube, LinkedIn and links to the Apps of our partners**
1. *Purpose of processing:* Sharing data with third-party web links, applications, plug-ins you've authorized
1. *Lawful basis:* Consent
1. *Data location and security:* Across the globe and in particular in the USA and the EU
1. *Personal data collected by third party:* Information you share with us, dependent on the permissions requested by the application or web client, including:Basic account information; Public information; Contact information
1. *Privacy policy:* Please refer to the individual 3rd parties privacy policies.

* **Mailchimp**
1. *Purpose of processing:* Sharing data with third-party web links, applications, plug-ins you've authorized
1. *Lawful basis:* Consent
1. *Data location and security:* USA
1. *Personal data collected by third party:* Email
1. *Privacy policy:* [Link](https://mailchimp.com/legal/privacy/)


## 6. Cookies

A cookie is a small file placed on the hard drive of your computer or other device. You may refuse to accept browser cookies by activating the appropriate setting on your browser. However, if you select this setting you may be unable to access certain parts of our App. Unless you have adjusted your browser setting so that it will refuse cookies, our system will issue cookies when you direct your browser to our App.

Pages of the App and our emails sent through a third party provider may contain small electronic files known as web beacons (also referred to as clear gifs, pixel tags, and single-pixel gifs or tracking pixels) that permit us, for example, to count users who have visited those pages or opened an email and for other related App statistics (for example, recording the popularity of certain App content and verifying system and server integrity).

## 7. Retention of data

We process and store the personal data of you as long as necessary to provide you with the services or for the period necessary to achieve another purpose of storage, or as far as this is granted by laws or regulations to which we are subject to. After expiration of that period, the corresponding data is routinely deleted, subject to it no longer being necessary for the fulfilment of the contract or the initiation of a contract.

We also collect and maintain aggregated, anonymized or pseudonymized information which we may retain indefinitely to protect the safety and security of our App, improve our services or comply with legal obligations. 

## 8. Your rights

Many countries’ privacy laws provide certain rights for data subjects. These rights depend on the applicable data protection legislation and may be either more limited or more comprehensive. In particular:



*   You can view, edit, or delete your personal data online. If you wish to confirm that we are processing your personal data, or to have access to the personal data we may have about you, please contact us at <support@ethereum.world>. Reasonable access to your personal data will be provided at no cost to you by us. If for some reason access is denied, we will provide an explanation as to why access has been denied.
*   You also have a right to request the data that you have provided to us (right to data portability). Upon request and if technically feasible, we will transfer your data to a third party of your choice. You have a right to receive the data in a common file format.
*   You may also request information about: the purpose of the processing; the categories of personal data concerned; who else outside us might have received the data from us; what the source of the information was (if you did not provide it directly to us); and how long it will be stored. 
*   You have a right to correct (rectify) the record of your personal data maintained by us if it is inaccurate. 
*   You may request that we erase that data, cease or restrict processing it, subject to certain exceptions. In case of automated decision making, including profiling, you may request human intervention or challenge a decision.
*   In many countries, you have a right to lodge a complaint with the appropriate data protection authority if you have concerns about how we process your information.

## 9. How do we keep your information safe?

We have put in place systems to safeguard the information you provide to us. We will never provide access to our databases to any third party, except to the extent necessary to conduct the operations of the App and our activities described in this Privacy Policy.

## 10. Do we transfer personal data abroad?

We are entitled to transfer your personal data to third parties (contracted service providers such as InnoCraft Ltd [creators of Matomo]) abroad for the purpose of the data processing described in this Privacy Policy. These are bound to protect data to the same extent as we are. If the level of data protection in a country does not correspond to that in Switzerland or the rest of Europe, we will contractually ensure that the protection of your personal data always corresponds to that in Switzerland or the rest of Europe.

In particular, this applies to data transfers to the USA, which from the point of view of the European Union and Switzerland does not have an adequate level of data protection. We will make sure that we implement guarantees to ensure an appropriate level of data protection. To do so we will make use of the guarantees recognised as sufficient in the European Union and Switzerland, as applicable.

## 11. Changes of the Privacy Policy

Should individual parts of this Privacy Policy be invalid, this shall not affect the validity of the rest of the Privacy Policy. The invalid part of this Privacy Policy shall be replaced in such a way that it comes as close as possible to the economically intended purpose of the invalid part.

Due to the further development of our App and offers or changes to the statutory requirements, it may become necessary to amend this Privacy Policy. The most current Privacy Policy is published on our App.

This Privacy Policy was last updated on March 24, 2021.

## 12. Which law do we apply? And where does the law apply?

This Privacy Policy is subject to Swiss law, unless the law of another country is mandatory.

The place of jurisdiction shall be the registered office of the Ethereum World Association, unless another place of jurisdiction is mandatory.

## 13. Contact

You can contact us by Email: <support@ethereum.world> 
The controller of the processing of your Information is: Ethereum World Association, represented by Codex Execution GmbH, Gartenstrasse 6, 6300 Zug, Switzerland Website: https://ethereum.world
`}
      />
    </Box>
  ));
