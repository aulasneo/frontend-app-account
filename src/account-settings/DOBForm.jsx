import PropTypes from 'prop-types';
import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';
import {
  Form, StatefulButton, ModalDialog, ActionRow, useToggle, Button,
} from '@edx/paragon';
import React, { useCallback, useEffect } from 'react';
import { connect, useDispatch } from 'react-redux';
import messages from './AccountSettingsPage.messages';
import { YEAR_OF_BIRTH_OPTIONS } from './data/constants';
import { editableFieldSelector } from './data/selectors';
import { saveSettingsReset } from './data/actions';

function DOBModal(props) {
  const {
    saveState,
    error,
    onSubmit,
    intl,
  } = props;

  const dispatch = useDispatch();

  // eslint-disable-next-line no-unused-vars
  const [isOpen, open, close, toggle] = useToggle(true, {});

  const handleSubmit = (e) => {
    e.preventDefault();

    const month = e.target.month.value;
    const year = e.target.year.value;
    const job_title = e.target.job_title.value;
    const city = e.target.city.value;
    const phone_number = e.target.phone_number.value;
    const last_name = e.target.last_name.value;
    const language = e.target.language.value;
    const data = [
      ...(month !== '' && year !== '' ? [{ field_name: 'DOB', field_value: `${year}-${month}` }] : []),
      ...(job_title !== '' ? [{ field_name: 'job_title', field_value: job_title }] : []),
      ...(city !== '' ? [{ field_name: 'city', field_value: city }] : []),
      ...(phone_number !== '' ? [{ field_name: 'phone_number', field_value: phone_number }] : []),
      ...(last_name !== '' ? [{ field_name: 'last_name', field_value: last_name }] : []),
      ...(language !== '' ? [{ field_name: 'language', field_value: language }] : []),
    ];
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
  }, [handleComplete, saveState, isOpen]);

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
                {YEAR_OF_BIRTH_OPTIONS.map(year => (
                  <option key={year.value} value={year.value}>{year.label}</option>
                ))}
              </Form.Control>
            </Form.Group>
            <Form.Group>
            <Form.Label>
              {intl.formatMessage(messages['account.settings.field.job_title'])}
            </Form.Label>
            <Form.Control
              as="input"
              name="job_title"
              type="text"
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>
              {intl.formatMessage(messages['account.settings.field.city'])}
            </Form.Label>
            <Form.Control
              as="input"
              name="city"
              type="text"
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>
              {intl.formatMessage(messages['account.settings.field.phone_number'])}
            </Form.Label>
            <Form.Control
              as="input"
              name="phone_number"
              type="text"
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>
              {intl.formatMessage(messages['account.settings.field.last_name'])}
            </Form.Label>
            <Form.Control
              as="input"
              name="last_name"
              type="text"
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>
              {intl.formatMessage(messages['account.settings.field.language'])}
            </Form.Label>
            <Form.Control
              as="input"
              name="language"
              type="text"
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
                state={saveState}
                labels={{
                  default: intl.formatMessage(messages['account.settings.editable.field.action.save']),
                }}
                disabledStates={[]}
              />
            </ActionRow>
          </ModalDialog.Footer>

        </form>
      </ModalDialog>
    </>
  );
}

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
