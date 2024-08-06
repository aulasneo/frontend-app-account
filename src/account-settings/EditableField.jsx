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
    years_of_experience,
    custom_profession,
    type_of_organization,
    profession,
    name,
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

  const determineValueToRender = () => {
    if (profession) {
      return renderValue(profession);
    } else if (custom_profession) {
      return renderValue(custom_profession);
    } else if (type_of_organization) {
      return renderValue(type_of_organization)
    } else if (years_of_experience) {
      return renderValue(years_of_experience)
    } else {
      return renderValue(value);
    }
  };

  return (
    <SwitchContent
      expression={isEditing ? 'editing' : 'default'}
      cases={{
        editing: (
          <>
            <form onSubmit={handleSubmit}>
              <ValidationFormGroup
                for={id}
                invalid={error != null}
                invalidMessage={error}
                helpText={helpText}
              >
                <label className="h6 d-block" htmlFor={id}>{label}</label>
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
              <p>
                <StatefulButton
                  type="submit"
                  className="mr-2"
                  state={saveState}
                  labels={{
                    default: intl.formatMessage(messages['account.settings.editable.field.action.save']),
                  }}
                  onClick={(e) => {
                    if (saveState === 'pending') { e.preventDefault(); }
                  }}
                  disabledStates={[]}
                />
                <Button
                  variant="outline-primary"
                  onClick={handleCancel}
                >
                  {intl.formatMessage(messages['account.settings.editable.field.action.cancel'])}
                </Button>
              </p>
            </form>
            {['name', 'verified_name'].includes(name) && <CertificatePreference fieldName={name} />}
          </>
        ),
        default: (
          <div className="form-group">
            <div className="d-flex align-items-start">
              <h6 aria-level="3">{label}</h6>
              {isEditable ? (
                <Button variant="link" onClick={handleEdit} className="ml-3">
                  <FontAwesomeIcon className="mr-1" icon={faPencilAlt} />{intl.formatMessage(messages['account.settings.editable.field.action.edit'])}
                </Button>
              ) : null}
            </div>
            <p data-hj-suppress className={isGrayedOut ? 'grayed-out' : null}>{determineValueToRender()}</p>
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
