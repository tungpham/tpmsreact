import React from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import ProfileInformationForm from '../../components/ProfileInformationForm';


export class Profile extends React.PureComponent {
  render() {
    return (
      <ProfileInformationForm onSubmit={() => {}} />
    );
  }
}



const mapStateToProps = createStructuredSelector({

});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Profile);


