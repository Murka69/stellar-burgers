import {
  getFeedData,
  getOrderByNum,
  TStateFeed,
  feedDataSlice
} from './feedDataSlice';

const initialState: TStateFeed = {
  orders: [],
  total: 0,
  totalToday: 0,
  error: null,
  loading: false,
  modalOrder: null
};

const testOrders = {
  success: true,
  orders: [
    {
      _id: '1',
      ingredients: [
        '643d69a5c3f7b9001cfa093c',
        '643d69a5c3f7b9001cfa093c',
        '643d69a5c3f7b9001cfa093e'
      ],
      status: 'done',
      name: 'Краторный люминесцентный бургер',
      createdAt: '2024-09-02T13:46:25.234Z',
      updatedAt: '2024-09-02T13:46:25.914Z',
      number: 1
    },
    {
      _id: '2',
      ingredients: [
        '643d69a5c3f7b9001cfa0941',
        '643d69a5c3f7b9001cfa093f',
        '643d69a5c3f7b9001cfa0946',
        '643d69a5c3f7b9001cfa0949',
        '643d69a5c3f7b9001cfa0945',
        '643d69a5c3f7b9001cfa093c'
      ],
      status: 'done',
      name: 'Антарианский краторный бессмертный минеральный экзо-плантаго био-марсианский бургер',
      createdAt: '2024-09-02T07:36:55.648Z',
      updatedAt: '2024-09-02T07:36:56.126Z',
      number: 2
    },
    {
      _id: '3',
      ingredients: [
        '643d69a5c3f7b9001cfa093c',
        '643d69a5c3f7b9001cfa0943',
        '643d69a5c3f7b9001cfa093c'
      ],
      status: 'done',
      name: 'Краторный space бургер',
      createdAt: '2024-09-02T07:34:44.831Z',
      updatedAt: '2024-09-02T07:34:45.280Z',
      number: 3
    }
  ],
  total: 3,
  totalToday: 3
};

describe('Feed data slice tests', () => {
  it('test should set load to true and err to null during pending status', () => {
    const actualState = feedDataSlice.reducer(
      {
        ...initialState,
        error: 'Test err'
      },
      getFeedData.pending('')
    );
    expect(actualState).toEqual({
      orders: [],
      total: 0,
      totalToday: 0,
      error: null,
      loading: true,
      modalOrder: null
    });
  });

  it('test should set load to false and upd feed data', () => {
    const actualState = feedDataSlice.reducer(
      {
        ...initialState,
        loading: true
      },
      getFeedData.fulfilled(testOrders, '')
    );

    expect(actualState).toEqual({
      orders: testOrders.orders,
      total: testOrders.total,
      totalToday: testOrders.totalToday,
      error: null,
      loading: false,
      modalOrder: null
    });
  });

  it('test should set err to err message and loading to false', () => {
    const testErr = new Error('Test err');
    const actualState = feedDataSlice.reducer(
      {
        ...initialState,
        loading: true
      },
      getFeedData.rejected(testErr, '')
    );

    expect(actualState).toEqual({
      orders: [],
      total: 0,
      totalToday: 0,
      modalOrder: null,
      loading: false,
      error: 'Test err'
    });
  });

  it('test get order by number should set loading to true', () => {
    const actualState = feedDataSlice.reducer(
      {
        ...initialState,
        error: 'Test err'
      },
      getOrderByNum.pending('1', 1)
    );
    expect(actualState).toEqual({
      orders: [],
      total: 0,
      totalToday: 0,
      error: null,
      loading: true,
      modalOrder: null
    });
  });

  it('test get order by number should set loading to false', () => {
    const actualState = feedDataSlice.reducer(
      {
        ...initialState,
        loading: true
      },
      getOrderByNum.fulfilled(testOrders, '1', 1)
    );

    expect(actualState).toEqual({
      orders: [],
      total: 0,
      totalToday: 0,
      error: null,
      loading: false,
      modalOrder: testOrders.orders[0]
    });
  });

  it('test get order by number should set loading to false and set err', () => {
    const testErr = new Error('Test err');
    const actualState = feedDataSlice.reducer(
      {
        ...initialState,
        loading: true
      },
      getOrderByNum.rejected(testErr, '1', 1)
    );
    expect(actualState).toEqual({
      orders: [],
      total: 0,
      totalToday: 0,
      modalOrder: null,
      loading: false,
      error: 'Test err'
    });
  });
});
