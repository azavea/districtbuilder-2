import * as actions from '../actions';
import { createStore } from 'redux'
import rootReducer from './index';

describe('assigning geounits to districts', () => {
  it('should assign districts', () => {
    // Given
    const store = createStore(rootReducer);
    const districts = [0, 0, 0];
    // When
    actions.generateAssignedDistricts(districts)(store.dispatch, store.getState);
    // Then
    expect(store.getState().historyState.present.districts).toEqual(districts);
  });
  it('should select districts', () => {
    // Given
    const store = createStore(rootReducer);
    const selectedDistrictId = 2;
    // When
    store.dispatch(actions.selectDistrict(selectedDistrictId));
    // Then
    expect(store.getState().historyState.present.selectedDistrict).toEqual(selectedDistrictId);
  });
  it('should select geounits', () => {
    // Given
    const store = createStore(rootReducer);
    const geounitId = 9;
    const geounitIds = [geounitId];
    // When
    store.dispatch({
      type: actions.SELECT_GEOUNIT,
      payload: {
        id: geounitId,
        countyIds: geounitIds,
      },
    });
    // Then
    expect(store.getState().historyState.present.selectedIds).toEqual(geounitIds);
  });
  it('should accept changes', () => {
    // Given
    const store = createStore(rootReducer);
    const districts = [0, 0, 0];  // NOTE: districts has one item for each geounit
    const selectedDistrictId = 2;
    const geounitId = 1;
    const geounitIds = [geounitId];
    // When
    actions.generateAssignedDistricts(districts)(store.dispatch, store.getState);
    store.dispatch(actions.selectDistrict(selectedDistrictId));
    store.dispatch({
      type: actions.SELECT_GEOUNIT,
      payload: {
        id: geounitId,
        countyIds: geounitIds,
      },
    });
    actions.acceptChanges()(store.dispatch, store.getState);
    // Then
    const expectedDistricts = [0, 2, 0];
    expect(store.getState().historyState.present.districts).toEqual(expectedDistricts);
  });
});
