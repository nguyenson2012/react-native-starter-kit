import { Screen } from './screen';
import { mapStateToProps } from './map_state_to_props';
import { mapDispatchToProps } from './map_dispatch_to_props';
import { connect } from 'react-redux';
export const AppLoaderScreen = connect(
  mapStateToProps,
  mapDispatchToProps,
)(Screen);
