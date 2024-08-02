import PropTypes from 'prop-types';
import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';
import {
  Form, StatefulButton, ModalDialog, ActionRow, useToggle, Button,
} from '@edx/paragon';
import React, { useCallback, useEffect, useState } from 'react';
import { connect, useDispatch } from 'react-redux';
import messages from './AccountSettingsPage.messages';
import { YEAR_OF_BIRTH_OPTIONS } from './data/constants';
import { editableFieldSelector } from './data/selectors';
import { saveSettingsReset } from './data/actions';

const DOBModal = (props) => {
  const {
    saveState,
    error,
    onSubmit,
    intl,
  } = props;

  const dispatch = useDispatch();

  // eslint-disable-next-line no-unused-vars
  const [isOpen, open, close, toggle] = useToggle(true, {});
  // const [monthValue, setMonthValue] = useState('');
  // const [yearValue, setYearValue] = useState('');

  // const handleChange = (e) => {
  //   e.preventDefault();

  //   if (e.target.name === 'month') {
  //     setMonthValue(e.target.value);
  //   } else if (e.target.name === 'year') {
  //     setYearValue(e.target.value);
  //   }
  // };

  const handleSubmit = (e) => {
    e.preventDefault();

    const month = e.target.month.value;
    const year = e.target.year.value;
    const profession = e.target.profession.value;
    const custom_profession = e.target.custom_profession.value;
    const type_of_organization = e.target.type_of_organization.value;
    const years_of_experience = e.target.years_of_experience.value;

    const data = [
      ...(month !== '' && year !== '' ? [{ field_name: 'DOB', field_value: `${year}-${month}` }] : []),
      ...(profession !== '' ? [{ field_name: 'profession', field_value: profession }] : []),
      ...(custom_profession !== '' ? [{ field_name: 'custom_profession', field_value: custom_profession }] : []),
      ...(type_of_organization !== '' ? [{ field_name: 'type_of_organization', field_value: type_of_organization }] : []),
      ...(years_of_experience !== '' ? [{ field_name: 'years_of_experience', field_value: years_of_experience }] : []),
    ]
    onSubmit('extended_profile', data);
  };

  const handleComplete = useCallback(() => {
    localStorage.setItem('submittedDOB', 'true');
    close();
    dispatch(saveSettingsReset());
  }, [dispatch, close]);

  const handleClose = useCallback(() => {
    close();
    dispatch(saveSettingsReset());
  }, [dispatch, close]);

  function renderErrors() {
    if (saveState === 'error' || error) {
      return (
        <Form.Control.Feedback type="invalid" key="general-error">
          {intl.formatMessage(messages['account.settingsfield.dob.error.general'])}
        </Form.Control.Feedback>
      );
    }
    return null;
  }

  useEffect(() => {
    if (saveState === 'complete' && isOpen) {
      handleComplete();
    }
  }, [handleComplete, saveState, isOpen, monthValue, yearValue]);

  return (
    <>
      <Button variant="primary" onClick={open}>
        {intl.formatMessage(messages['account.settings.field.dob.form.button'])}
      </Button>
      <ModalDialog
        title={intl.formatMessage(messages['account.settings.field.dob.form.title'])}
        isOpen={isOpen}
        onClose={handleClose}
        hasCloseButton={false}
        variant="default"
      >
        <form onSubmit={handleSubmit}>

          <ModalDialog.Header>
            <ModalDialog.Title>
              {intl.formatMessage(messages['account.settings.field.dob.form.title'])}
            </ModalDialog.Title>
          </ModalDialog.Header>

          <ModalDialog.Body className="overflow-hidden" style={{ padding: '1.5rem' }}>
            <p>{intl.formatMessage(messages['account.settings.field.dob.form.help.text'])}</p>
            <Form.Group>
              <Form.Label>
                {intl.formatMessage(messages['account.settings.field.dob.month'])}
              </Form.Label>
              <Form.Control
                as="select"
                name="month"
              >
                {/* <option value="">{intl.formatMessage(messages['account.settings.field.dob.month.default'])}</option> */}
                {[...Array(12).keys()].map(month => (
                  <option key={month + 1} value={month + 1}>{month + 1}</option>
                ))}
              </Form.Control>
            </Form.Group>
            <Form.Group>
              <Form.Label>
                {intl.formatMessage(messages['account.settings.field.dob.year'])}
              </Form.Label>
              <Form.Control
                as="select"
                name="year"
              >
                <option value="">{intl.formatMessage(messages['account.settings.field.dob.year.default'])}</option>
                {YEAR_OF_BIRTH_OPTIONS.map(year => (
                  <option key={year.value} value={year.value}>{year.label}</option>
                ))}
              </Form.Control>
            </Form.Group>
            <Form.Group>
                <Form.Label>
                  {intl.formatMessage(messages['account.settings.field.profession'])}
                </Form.Label>
                <Form.Control
                  as="select"
                  name="profession"
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>
                  {intl.formatMessage(messages['account.settings.field.custom_profession'])}
                </Form.Label>
                <Form.Control
                  as="text"
                  name="custom_profession"
                />
                <Form.Group>
                <Form.Label>
                  {intl.formatMessage(messages['account.settings.field.type_of_organization'])}
                </Form.Label>
                <Form.Control
                  as="select"
                  name="type_of_organization"
                />
              </Form.Group>
              </Form.Group>
            <Form.Group>
                <Form.Label>
                  {intl.formatMessage(messages['account.settings.field.years_of_experience'])}
                </Form.Label>
                <Form.Control
                  as="select"
                  name="years_of_experience"
                />
              </Form.Group>
            {renderErrors()}
          </ModalDialog.Body>

          <ModalDialog.Footer>
            <ActionRow>
              <ModalDialog.CloseButton variant="tertiary">
                Cancel
              </ModalDialog.CloseButton>
              <StatefulButton
                type="submit"
                state={!(monthValue && yearValue) ? 'unedited' : saveState}
                labels={{
                  default: intl.formatMessage(messages['account.settings.editable.field.action.save']),
                }}
                disabledStates={['unedited']}
              />
            </ActionRow>
          </ModalDialog.Footer>

        </form>
      </ModalDialog>
    </>
  );
};

DOBModal.propTypes = {
  saveState: PropTypes.oneOf(['default', 'pending', 'complete', 'error']),
  error: PropTypes.string,
  onSubmit: PropTypes.func.isRequired,
  intl: intlShape.isRequired,
};

DOBModal.defaultProps = {
  saveState: undefined,
  error: undefined,
};

export default connect(editableFieldSelector)(injectIntl(DOBModal));
