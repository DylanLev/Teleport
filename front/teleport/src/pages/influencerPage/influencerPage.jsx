import React from 'react';
import "./influencerPage.scss";

const InfluencerPage = ({ influencer }) => {
  return (
    <div className="influencer-page">
      <h1>{influencer.name}</h1>
      <p className="description">{influencer.description}</p>
      
      {influencer.wikidataId && (
        <a href={`https://www.wikidata.org/wiki/${influencer.wikidataId}`} target="_blank" rel="noopener noreferrer">Wikidata Profile</a>
      )}
      
      {influencer.socialMedia && influencer.socialMedia.length > 0 && (
        <>
          <h2>Social Media</h2>
          <ul className="social-media-list">
            {influencer.socialMedia.map((account, index) => (
              <li key={index}>
                {account.platform}: @{account.username} ({account.followers} followers)
              </li>
            ))}
          </ul>
        </>
      )}

      {influencer.website && (
        <>
          <h2>Website</h2>
          <a href={influencer.website} target="_blank" rel="noopener noreferrer">{influencer.website}</a>
        </>
      )}

      {influencer.privateGroup && (
        <>
          <h2>Private Group</h2>
          <p>{influencer.privateGroup}</p>
        </>
      )}

      {influencer.location && (
        <>
          <h2>Location</h2>
          <p>{influencer.location}</p>
        </>
      )}

      {influencer.latestContent && (
        <>
          <h2>Latest Content</h2>
          <div className="latest-content">
            <p>{influencer.latestContent.type}: {influencer.latestContent.content}</p>
            <p>Date: {influencer.latestContent.date}</p>
          </div>
        </>
      )}

      {influencer.latestWork && (
        <>
          <h2>Latest Work</h2>
          <p>{influencer.latestWork}</p>
        </>
      )}

      {influencer.events && influencer.events.length > 0 && (
        <>
          <h2>Upcoming Events</h2>
          <ul className="events-list">
            {influencer.events.map((event, index) => (
              <li key={index}>
                {event.name} - {event.date} in {event.location}
              </li>
            ))}
          </ul>
        </>
      )}

      {influencer.netWorth && (
        <>
          <h2>Estimated Net Worth</h2>
          <p>{influencer.netWorth}</p>
        </>
      )}
    </div>
  );
};

export default InfluencerPage;