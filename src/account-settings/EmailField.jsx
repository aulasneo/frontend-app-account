import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { injectIntl, intlShape, FormattedMessage } from '@edx/frontend-platform/i18n';
import {
  Button, StatefulButton, Input, ValidationFormGroup,
} from '@edx/paragon';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle, faPencilAlt } from '@fortawesome/free-solid-svg-icons';

import Alert from './Alert';
import SwitchContent from './SwitchContent';
import messages from './AccountSettingsPage.messages';

import {
  openForm,
  closeForm,
} from './data/actions';
import { editableFieldSelector } from './data/selectors';

function EmailField(props) {
  const {
    name,
    label,
    emptyLabel,
    value,
    saveState,
    error,
    confirmationMessageDefinition,
    confirmationValue,
    helpText,
    onEdit,
    onCancel,
    onSubmit,
    onChange,
    isEditing,
    isEditable,
    intl,
  } = props;
  const id = `field-${name}`;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(name, new FormData(e.target).get(name));
  };

  const handleChange = (e) => {
    onChange(name, e.target.value);
  };

  const handleEdit = () => {
    onEdit(name);
  };

  const handleCancel = () => {
    onCancel(name);
  };

  const renderConfirmationMessage = () => {
    if (!confirmationMessageDefinition || !confirmationValue) {
      return null;
    }
    return (
      <Alert
        className="alert-warning mt-n2"
        icon={<FontAwesomeIcon className="mr-2 h6" icon={faExclamationTriangle} />}
      >
        <h6 aria-level="3">
          {intl.formatMessage(messages['account.settings.email.field.confirmation.header'])}
        </h6>
          {intl.formatMessage(confirmationMessageDefinition, { value: confirmationValue })}
      </Alert>
    );
  };

  const renderConfirmationValue = () => (
    <span>
      {confirmationValue}
      <span className="ml-3 text-muted small">
        <FormattedMessage
          id="account.settings.email.field.confirmation.header"
          defaultMessage="Pending confirmation"
          description="The label next to a new pending email address"
        />
      </span>
    </span>
  );

  const renderEmptyLabel = () => {
    if (isEditable) {
      return <Button variant="link" onClick={handleEdit} className="p-0">{emptyLabel}</Button>;
    }
    return <span className="text-muted">{emptyLabel}</span>;
  };

  const renderValue = () => {
    if (confirmationValue) {
      return renderConfirmationValue();
    }
    return value || renderEmptyLabel();
  };

  return (
    <SwitchContent
      expression={isEditing ? 'editing' : 'default'}
      cases={{
        editing: (
        <>
          <form className="form-account" onSubmit={handleSubmit}>
            <ValidationFormGroup
              for={id}
              invalid={error != null}
              invalidMessage={error}
              helpText={helpText}
            >
            <div className="buttons">
              <label className="label-account" htmlFor={id}>{label}</label>
              <div className="button-cont">
              <Button
                type="submit"
                className="buttonSave"
                state={saveState}
                labels={{
                  default: intl.formatMessage(messages['account.settings.editable.field.action.save']),
                }}
                onClick={(e) => {
                  // Swallow clicks if the state is pending.
                  // We do this instead of disabling the button to prevent
                  // it from losing focus (disabled elements cannot have focus).
                  // Disabling it would causes upstream issues in focus management.
                  // Swallowing the onSubmit event on the form would be better, but
                  // we would have to add that logic for every field given our
                  // current structure of the application.
                  if (saveState === 'pending') { e.preventDefault(); }
                }}
                disabledStates={[]}
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1 9.5L5.5 14L15 1.5" stroke="#2CBB7F" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </Button>
              <Button
                className="button-cancel"
                variant="outline-primary"
                onClick={handleCancel}
              >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M13.5 2.5L2.5 13.5" stroke="#B00020" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M2.5 2.5L13.5 13.5" stroke="#B00020" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              </Button>
             </div>
            </div>
            <Input
                data-hj-suppress
                name={name}
                id={id}
                type="email"
                value={value}
                onChange={handleChange}
              />
            </ValidationFormGroup>
          </form>
      </>    
        ),
        default: (
        <>
          <form onSubmit={handleSubmit}>
            <ValidationFormGroup
              for={id}
              invalid={error != null}
              invalidMessage={error}
              helpText={helpText}
            >
            <div className="buttons">
              <label className="label-account" htmlFor={id}>{label}</label>
              <div className="button-cont">
              <Button
                  className="buttonSave"
                  onClick={handleEdit}
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10.5 0.5L13.5 3.5L5 12L1 13L2 9L10.5 0.5Z" stroke="#666666" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M8.5 2.5L11.5 5.5" stroke="#666666" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </Button>
                </div>
              </div>
              <Input
                data-hj-suppress
                name={name}
                id={id}
                type="email"
                value={value}
                onChange={handleChange}
                disabled
              />
            </ValidationFormGroup>
          </form> 
        </>
          
        ),
      }}
    />
  );
}

EmailField.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  emptyLabel: PropTypes.node,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  saveState: PropTypes.oneOf(['default', 'pending', 'complete', 'error']),
  error: PropTypes.string,
  confirmationMessageDefinition: PropTypes.shape({
    id: PropTypes.string.isRequired,
    defaultMessage: PropTypes.string.isRequired,
    description: PropTypes.string,
  }),
  confirmationValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  helpText: PropTypes.node,
  onEdit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  isEditing: PropTypes.bool,
  isEditable: PropTypes.bool,
  intl: intlShape.isRequired,
};

EmailField.defaultProps = {
  value: undefined,
  saveState: undefined,
  label: undefined,
  emptyLabel: undefined,
  error: undefined,
  confirmationMessageDefinition: undefined,
  confirmationValue: undefined,
  helpText: undefined,
  isEditing: false,
  isEditable: true,
};

export default connect(editableFieldSelector, {
  onEdit: openForm,
  onCancel: closeForm,
})(injectIntl(EmailField));


{/* <div className="form-group">
          //   <div className="d-flex align-items-start">
          //     <h6 aria-level="3">{label}</h6>
          //     {isEditable ? (
          //       <Button variant="link" onClick={handleEdit} className="ml-3">
          //         <FontAwesomeIcon className="mr-1" icon={faPencilAlt} />
          //         {/*{intl.formatMessage(messages['account.settings.editable.field.action.edit'])}
          //       </Button>
          //     ) : null}
          //   </div>
          //   <p data-hj-suppress>{renderValue()}</p>
          //   {renderConfirmationMessage() || <p className="small text-muted mt-n2">{helpText}</p>}
          // </div>*/}