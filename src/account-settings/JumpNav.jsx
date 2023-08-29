import { getConfig } from '@edx/frontend-platform';
import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';
import { breakpoints, useWindowSize } from '@edx/paragon';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import { NavHashLink } from 'react-router-hash-link';
import Scrollspy from 'react-scrollspy';
import messages from './AccountSettingsPage.messages';

const JumpNav = ({
  intl,
  displayDemographicsLink,
}) => {
  const stickToTop = useWindowSize().width > breakpoints.small.minWidth;
  
  return (
    <div className={classNames('jump-nav', { 'jump-nav-sm position-sticky pt-3': stickToTop })}>
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
        currentClassName="font-weight-bold d-flex "
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
          <NavHashLink to="#social-media" style={window.location.href.includes("#social-media") ? {fontWeight:"700"} : {fontWeight:"300"}}>
            {intl.formatMessage(messages['account.settings.section.social.media'])}
          </NavHashLink>
        </li>
        <li>
          <NavHashLink to="#site-preferences" style={window.location.href.includes("#site-preferences") ? {fontWeight:"700"} : {fontWeight:"300"}}>
            {intl.formatMessage(messages['account.settings.section.site.preferences'])}
          </NavHashLink>
        </li>
        <li>
          <NavHashLink to="#linked-accounts" style={window.location.href.includes("#linked-accounts") ? {fontWeight:"700"} : {fontWeight:"300"}}>
            {intl.formatMessage(messages['account.settings.section.linked.accounts'])}
          </NavHashLink>
        </li>
        <li>
          <NavHashLink to="#delete-account" style={window.location.href.includes("#delete-account") ? {fontWeight:"700"} : {fontWeight:"300"}}>
            {intl.formatMessage(messages['account.settings.jump.nav.delete.account'])}
          </NavHashLink>
        </li>
      </Scrollspy>
    </div>
  );
};

JumpNav.propTypes = {
  intl: intlShape.isRequired,
  displayDemographicsLink: PropTypes.bool.isRequired,
};

export default injectIntl(JumpNav);
