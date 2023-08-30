import { getConfig } from '@edx/frontend-platform';
import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';
import { breakpoints, useWindowSize, Button } from '@edx/paragon';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { NavHashLink } from 'react-router-hash-link';
import Scrollspy from 'react-scrollspy';
import messages from './AccountSettingsPage.messages';

const JumpNav = ({
  intl,
  displayDemographicsLink,
}) => {
  const stickToTop = useWindowSize().width > breakpoints.small.minWidth;
  
  const [expandAll, setExpandAll] = useState(false);
  
  return (
    <div className={classNames('jump-nav', { 'jump-nav-sm position-sticky pt-3': stickToTop })}>
      <div className= "button-contened">
      <Scrollspy
        items={[
          'basic-information',
          'reset-password',
          'profile-information',
          'demographics-information',
          'social-media',
          'site-preferences',
          'linked-accounts',
          'delete-account',
        ]}
        className="list-unstyled"
        currentClassName="font-weight-bold d-flex"
        style={{ height: expandAll ? 'auto' : '1.6rem', width: '100%' }}
      >
        <li>
          <NavHashLink to="#basic-information" style={window.location.href.includes("#basic-information") ? {fontWeight:"700"} : {fontWeight:"300"}}>
            {intl.formatMessage(messages['account.settings.section.account.information'])}
          </NavHashLink>
        </li>
        <li>
          <NavHashLink to="#reset-password" style={window.location.href.includes("#reset-password") ? {fontWeight:"700"} : {fontWeight:"300"}}>
            {intl.formatMessage(messages['account.settings.section.account.information.resetpassword'])}
          </NavHashLink>
        </li>
        <li>
          <NavHashLink to="#profile-information" style={window.location.href.includes("#profile-information") ? {fontWeight:"700"} : {fontWeight:"300"}}>
            {intl.formatMessage(messages['account.settings.section.profile.information'])}
          </NavHashLink>
        </li>
        {getConfig().ENABLE_DEMOGRAPHICS_COLLECTION && displayDemographicsLink
          && (
          <li>
            <NavHashLink to="#demographics-information" style={window.location.href.includes("#demographics-information") ? {fontWeight:"700"} : {fontWeight:"300"}}>
              {intl.formatMessage(messages['account.settings.section.demographics.information'])}
            </NavHashLink>
          </li>
          )}
        <li>
          <NavHashLink to="#social-media" style={window.location.href.includes("#social-media") ? {fontWeight:"700"} : {fontWeight:"300"}} >
            {intl.formatMessage(messages['account.settings.section.social.media'])}
          </NavHashLink>
        </li>
        <li>
          <NavHashLink to="#site-preferences" style={window.location.href.includes("#site-preferences") ? {fontWeight:"700"} : {fontWeight:"300"}} >
            {intl.formatMessage(messages['account.settings.section.site.preferences'])}
          </NavHashLink>
        </li>
        <li>
          <NavHashLink to="#linked-accounts" style={window.location.href.includes("#linked-accounts") ? {fontWeight:"700"} : {fontWeight:"300"}} >
            {intl.formatMessage(messages['account.settings.section.linked.accounts'])}
          </NavHashLink>
        </li>
        <li>
          <NavHashLink to="#delete-account" style={window.location.href.includes("#delete-account") ? {fontWeight:"700"} : {fontWeight:"300"}} >
            {intl.formatMessage(messages['account.settings.jump.nav.delete.account'])}
          </NavHashLink>
        </li>
      </Scrollspy>
      <button className="button-expand" block onClick={() => { setExpandAll(!expandAll); }}>
            {!expandAll
              ?
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3.5 6.5L8 11L12.5 6.5" stroke="#666666" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              :
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M13.3833 10.5553L8.9391 6.00023L4.38398 10.4444" stroke="#666666" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            }
      </button>
      
      </div>
    </div>
  );
};

JumpNav.propTypes = {
  intl: intlShape.isRequired,
  displayDemographicsLink: PropTypes.bool.isRequired,
};

export default injectIntl(JumpNav);
