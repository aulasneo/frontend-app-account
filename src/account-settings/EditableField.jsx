/* eslint-disable react/jsx-no-useless-fragment */
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getConfig } from '@edx/frontend-platform';
import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';
import {
  Button, Input, StatefulButton, ValidationFormGroup,
} from '@edx/paragon';
import { faPencilAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import SwitchContent from './SwitchContent';
import messages from './AccountSettingsPage.messages';

import {
  openForm,
  closeForm,
} from './data/actions';
import { editableFieldSelector } from './data/selectors';
import CertificatePreference from './certificate-preference/CertificatePreference';

function EditableField(props) {
  const {
    name,
    job_title,
    city,
    phone_number,
    language,
    label,
    emptyLabel,
    type,
    value,
    userSuppliedValue,
    options,
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
    isGrayedOut,
    intl,
    ...others
  } = props;
  const id = `field-${name}`;
  let inputOptions = options;
  if (getConfig().ENABLE_COPPA_COMPLIANCE && name === 'level_of_education' && options) {
    inputOptions = options.filter(option => option.value !== 'el');
  }

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

  const renderEmptyLabel = () => {
    if (isEditable) {
      return <Button variant="link" onClick={handleEdit} className="p-0">{emptyLabel}</Button>;
    }
    return <span className="text-muted">{emptyLabel}</span>;
  };

  const renderValue = (rawValue) => {
    if (!rawValue) {
      return renderEmptyLabel();
    }
    let finalValue = rawValue;

    if (options) {
      // Use == instead of === to prevent issues when HTML casts numbers as strings
      // eslint-disable-next-line eqeqeq
      const selectedOption = options.find(option => option.value == rawValue);
      if (selectedOption) {
        finalValue = selectedOption.label;
      }
    }

    if (userSuppliedValue) {
      finalValue += `: ${userSuppliedValue}`;
    }

    return finalValue;
  };

  const renderConfirmationMessage = () => {
    if (!confirmationMessageDefinition || !confirmationValue) {
      return null;
    }
    return intl.formatMessage(confirmationMessageDefinition, {
      value: confirmationValue,
    });
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
                  className="buttonSave"
                  type="submit"
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
                  <path d="M1 9.5L5.5 14L15 1.5" stroke="#2CBB7F" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
               </Button>
                <Button
                  className="button-cancel-account"
                  variant="outline-primary"
                  onClick={handleCancel}
                >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M13.5 2.5L2.5 13.5" stroke="#B00020" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M2.5 2.5L13.5 13.5" stroke="#B00020" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                </Button>
               </div>
              </div>
                <Input
                  data-hj-suppress
                  name={name}
                  id={id}
                  type={type}
                  value={value}
                  onChange={handleChange}
                  options={inputOptions}
                  {...others}
                />
                <>{others.children}</>
              </ValidationFormGroup>
            </form>
            {['name', 'verified_name'].includes(name) && <CertificatePreference fieldName={name} />}
          </>
        ),
        default: (
          <div className="form-group">
            <div className="label-title">
                {isEditable ? (
                <div className="button-cont">
                  <label className="label-account" htmlFor={id}>{label}</label>
                  <div className="buttons">
                    <Button className="buttonSave" onClick={handleEdit}>
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M10.5 0.5L13.5 3.5L5 12L1 13L2 9L10.5 0.5Z" stroke="#666666" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M8.5 2.5L11.5 5.5" stroke="#666666" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </Button>
                  </div> 
                </div>
                ) : null}
            </div>
            <p data-hj-suppress className="label-field">{renderValue(value)}</p>
            <p className="small text-muted mt-n2">{renderConfirmationMessage() || helpText}</p>
          </div>
        ),
      }}
    />
  );
}

EditableField.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.node]),
  emptyLabel: PropTypes.node,
  type: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  userSuppliedValue: PropTypes.string,
  options: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  })),
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
  isGrayedOut: PropTypes.bool,
  intl: intlShape.isRequired,
};

EditableField.defaultProps = {
  value: undefined,
  options: undefined,
  saveState: undefined,
  label: undefined,
  emptyLabel: undefined,
  error: undefined,
  confirmationMessageDefinition: undefined,
  confirmationValue: undefined,
  helpText: undefined,
  isEditing: false,
  isEditable: true,
  isGrayedOut: false,
  userSuppliedValue: undefined,
};

export default connect(editableFieldSelector, {
  onEdit: openForm,
  onCancel: closeForm,
})(injectIntl(EditableField));
