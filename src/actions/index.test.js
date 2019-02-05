import * as actions from '../actions';

describe('actions', () => {
  it('should create an action to lock a district', () => {
    const districtId = 12;
    const expectedAction = {
      type: actions.LOCK_DISTRICT,
      payload: districtId,
    };
    expect(actions.lockDistrict(districtId)).toEqual(expectedAction);
  });
});