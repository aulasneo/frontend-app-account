import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getConfig } from '@edx/frontend-platform';
import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';
import { Button, Hyperlink } from '@edx/paragon';

// Actions
import {
  deleteAccount,
  deleteAccountConfirmation,
  deleteAccountFailure,
  deleteAccountReset,
  deleteAccountCancel,
} from './data/actions';

// Messages
import messages from './messages';

// Components
import ConnectedConfirmationModal from './ConfirmationModal';
import PrintingInstructions from './PrintingInstructions';
import ConnectedSuccessModal from './SuccessModal';
import BeforeProceedingBanner from './BeforeProceedingBanner';

export class DeleteAccount extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      password: '',
    };
  }

  handleSubmit = () => {
    if (this.state.password === '') {
      this.props.deleteAccountFailure('empty-password');
    } else {
      this.props.deleteAccount(this.state.password);
    }
  };

  handleCancel = () => {
    this.setState({ password: '' });
    this.props.deleteAccountCancel();
  };

  handlePasswordChange = (e) => {
    this.setState({ password: e.target.value.trim() });
    this.props.deleteAccountReset();
  };

  handleFinalClose = () => {
    global.location = getConfig().LOGOUT_URL;
  };

  render() {
    const {
      hasLinkedTPA, isVerifiedAccount, status, errorType, intl,
    } = this.props;
    const canDelete = isVerifiedAccount && !hasLinkedTPA;

    // TODO: We lack a good way of providing custom language for a particular site.  This is a hack
    // to allow edx.org to fulfill its business requirements.
    const deleteAccountText2MessageKey = getConfig().SITE_NAME === 'edX'
      ? 'account.settings.delete.account.text.2.edX'
      : 'account.settings.delete.account.text.2';

    const optInInstructionMessageId = getConfig().MARKETING_EMAILS_OPT_IN
      ? 'account.settings.delete.account.please.confirm'
      : 'account.settings.delete.account.please.activate';

    return (
      <div>
        {/*<h2 className="section-heading h4 mb-3">
          {intl.formatMessage(messages['account.settings.delete.account.header'])}
        </h2>*/}
        <div className="alerlDelete">
          <svg width="40" height="20" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15.0828 12.512L9.15329 1.6882C8.80979 1.05145 8.01529 0.81395 7.37879 1.1572C7.15379 1.27845 6.96929 1.4632 6.84779 1.6882L0.918285 12.512C0.686035 12.9305 0.694785 13.441 0.940785 13.8514C1.17479 14.254 1.60554 14.5012 2.07104 14.5002H13.93C14.3955 14.5012 14.8263 14.254 15.0603 13.8514C15.3063 13.441 15.315 12.9305 15.0828 12.512ZM8.70429 5.51045L8.51054 10.2605C8.50504 10.3945 8.39479 10.5002 8.26079 10.5002H7.74079C7.60679 10.5002 7.49654 10.3945 7.49104 10.2605L7.29729 5.51045C7.29154 5.36845 7.40504 5.2502 7.54704 5.2502H8.45479C8.59679 5.2502 8.71029 5.36845 8.70454 5.51045H8.70429ZM8.00054 13.0002C7.58629 13.0002 7.25054 12.6645 7.25054 12.2502C7.25054 11.8359 7.58629 11.5002 8.00054 11.5002C8.41479 11.5002 8.75054 11.8359 8.75054 12.2502C8.75054 12.6645 8.41479 13.0002 8.00054 13.0002Z" fill="#B00020"/>
          </svg>

        <p className="text-danger-new">
           {intl.formatMessage(
             messages['account.settings.delete.account.text.warning'],
             { siteName: getConfig().SITE_NAME },
           )}
        </p>
        </div>
        <p className="weSorry">{intl.formatMessage(messages['account.settings.delete.account.subheader'])}</p>
        <p>
          {intl.formatMessage(
            messages['account.settings.delete.account.text.1'],
            { siteName: getConfig().SITE_NAME },
          )}
        </p>
        <p>
          {intl.formatMessage(
            messages[deleteAccountText2MessageKey],
            { siteName: getConfig().SITE_NAME },
          )}
        </p>
        <p>
          <PrintingInstructions />
        </p>
        {/* <p className="text-danger h6">
        //   {intl.formatMessage(
        //     messages['account.settings.delete.account.text.warning'],
        //     { siteName: getConfig().SITE_NAME },
        //   )}
        // </p>*/}
        <p>
          <Hyperlink className="hyperlink" destination="https://support.edx.org/hc/en-us/sections/115004139268-Manage-Your-Account-Settings">
            {intl.formatMessage(messages['account.settings.delete.account.text.change.instead'])}
          </Hyperlink>
        </p>
        <p>
          <Button
            variant="outline-danger"
            onClick={canDelete ? this.props.deleteAccountConfirmation : null}
            disabled={!canDelete}
          >
            {intl.formatMessage(messages['account.settings.delete.account.button'])}
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="24" height="24" rx="12" fill="white"/>
            <path d="M10.5 7.5L15 12L10.5 16.5" stroke="#3F64E7" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          </Button>
        </p>

        {isVerifiedAccount ? null : (
          <BeforeProceedingBanner
            instructionMessageId={optInInstructionMessageId}
            supportArticleUrl="https://support.edx.org/hc/en-us/articles/115000940568-How-do-I-confirm-my-email-"
          />
        )}

        {hasLinkedTPA ? (
          <BeforeProceedingBanner
            instructionMessageId="account.settings.delete.account.please.unlink"
            supportArticleUrl="https://support.edx.org/hc/en-us/articles/207206067"
          />
        ) : null}

        <ConnectedConfirmationModal
          status={status}
          errorType={errorType}
          onSubmit={this.handleSubmit}
          onCancel={this.handleCancel}
          onChange={this.handlePasswordChange}
          password={this.state.password}
        />

        <ConnectedSuccessModal status={status} onClose={this.handleFinalClose} />
      </div>
    );
  }
}

DeleteAccount.propTypes = {
  deleteAccount: PropTypes.func.isRequired,
  deleteAccountConfirmation: PropTypes.func.isRequired,
  deleteAccountFailure: PropTypes.func.isRequired,
  deleteAccountReset: PropTypes.func.isRequired,
  deleteAccountCancel: PropTypes.func.isRequired,
  status: PropTypes.oneOf(['confirming', 'pending', 'deleted', 'failed']),
  errorType: PropTypes.oneOf(['empty-password', 'server']),
  hasLinkedTPA: PropTypes.bool,
  isVerifiedAccount: PropTypes.bool,
  intl: intlShape.isRequired,
};

DeleteAccount.defaultProps = {
  hasLinkedTPA: false,
  isVerifiedAccount: true,
  status: null,
  errorType: null,
};

// Assume we're part of the accountSettings state.
const mapStateToProps = state => state.accountSettings.deleteAccount;

export default connect(
  mapStateToProps,
  {
    deleteAccount,
    deleteAccountConfirmation,
    deleteAccountFailure,
    deleteAccountReset,
    deleteAccountCancel,
  },
)(injectIntl(DeleteAccount));
