import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

// instead of props.alerts, since we have mapped state to props in mapStatetoProps, we can simply put in alerts
const Alert = ({ alerts }) =>
  alerts !== null &&
  alerts.length > 0 &&
  alerts.map(alert => (
    // return JSX for each alert
    // unique key for each JSX generated according to array
    // alert class, and ${alert.alertType} is template string variable
    // the tempelate string will resolve to something like alert-danger, if alertType is 'danger'
    <div key={alert.id} className={`alert alert-${alert.alertType}`}>
      {alert.msg}
    </div>
  ));

Alert.propTypes = {
  alerts: PropTypes.array.isRequired // alert is now a prop
};

// map redux state to a prop in this component
const mapStateToProps = state => ({
  alerts: state.alert // array of alerts
});

export default connect(mapStateToProps)(Alert);
