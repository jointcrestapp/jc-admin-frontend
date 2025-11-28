
import { StateContext } from "@ngxs/store";
import { WithdrawalService } from "src/app/core/services/withdrawal.service";
import { NotificationService } from "../../../services/notification.service";
import {
    UpdateWithdrawStatus
} from "../../action/withdrawal.action";
import { WithdrawalState, WithdrawalStateModel } from '../withdrawal.state';


// src/app/shared/store/state/withdrawal.state.updateWithdrawStatus.spec.ts




// src/app/shared/store/state/withdrawal.state.updateWithdrawStatus.spec.ts
// RxJS operator mocks
jest.mock("rxjs", () => {
  const actual = jest.requireActual("rxjs");
  return {
    ...actual,
    tap: jest.fn() as any,
    catchError: jest.fn() as any,
    throwError: jest.fn() as any,
    finalize: jest.fn() as any,
    map: jest.fn() as any,
    __esModule: true,
  };
});

// --- Jest mocks for class dependencies ---
const mockNotificationService = {
  showSuccess: jest.fn(),
  showError: jest.fn(),
} as unknown as jest.Mocked<NotificationService>;

const mockWithdrawalService = {
  updateWithdrawStatus: jest.fn(),
} as unknown as jest.Mocked<WithdrawalService>;

// --- Mock for StateContext ---
class MockStateContext implements StateContext<WithdrawalStateModel> {
  private state: WithdrawalStateModel;
  public setState = jest.fn();
  public patchState = jest.fn();
  public getState = jest.fn();

  constructor(initialState: WithdrawalStateModel) {
    this.state = initialState;
    this.getState = jest.fn().mockReturnValue(this.state);
  }
}

// --- Helper: default state ---
const defaultState: WithdrawalStateModel = {
  withdrawal: { data: [], total: 0 },
  pendingWithdrawal: { data: [], total: 0 },
  loading: false,
  response: null,
  selectedWithdrawal: null,
  statistics: null,
  member: null,
};

// --- Begin tests ---
describe('WithdrawalState.updateWithdrawStatus() updateWithdrawStatus method', () => {
  let state: WithdrawalState;
  let ctx: MockStateContext;

  beforeEach(() => {
    jest.clearAllMocks();
    ctx = new MockStateContext({ ...defaultState });
    state = new WithdrawalState(
      mockNotificationService as any,
      mockWithdrawalService as any
    );
  });

  // --- Happy Path Tests ---

  it('should call withdrawalService.updateWithdrawStatus with correct parameters and update state on success', async () => {
    // This test ensures the service is called and state is patched on success.
    const id = 123;
    const status = 'APPROVED';
    const action = { id, status } as UpdateWithdrawStatus;

    // Mock service to return observable with success response
    const serviceResponse = { success: true, id, status };
    (mockWithdrawalService.updateWithdrawStatus as any).mockReturnValue({
      pipe: jest.fn().mockReturnValue({
        subscribe: (success: any) => {
          success(serviceResponse);
        },
      }),
    } as any);

    // PatchState should be called with updated response
    ctx.patchState = jest.fn();

    // Act
    state.updateWithdrawStatus(ctx as any, action);

    // Assert
    expect(jest.mocked(mockWithdrawalService.updateWithdrawStatus)).toHaveBeenCalledWith(id, status);
    expect(jest.mocked(ctx.patchState)).toHaveBeenCalledWith({ response: serviceResponse });
    expect(jest.mocked(mockNotificationService.showSuccess)).toHaveBeenCalled();
  });

  it('should call patchState with loading true before service call and loading false after finalize', async () => {
    // This test ensures loading state is set before and after the call.
    const id = 1;
    const status = 'REJECTED';
    const action = { id, status } as UpdateWithdrawStatus;

    // Simulate observable chain with finalize
    let finalizeCallback: () => void = () => {};
    (mockWithdrawalService.updateWithdrawStatus as any).mockReturnValue({
      pipe: jest.fn().mockImplementation((...ops: any[]) => {
        // Find finalize in the chain and extract the callback
        ops.forEach((op: any) => {
          if (op.name === 'finalize') {
            finalizeCallback = op;
          }
        });
        return {
          subscribe: (success: any) => {
            success({ success: true });
            finalizeCallback();
          },
        };
      }),
    } as any);

    ctx.patchState = jest.fn();

    // Act
    state.updateWithdrawStatus(ctx as any, action);

    // Assert: loading true set before, loading false set after
    expect(jest.mocked(ctx.patchState)).toHaveBeenCalledWith({ loading: true });
    expect(jest.mocked(ctx.patchState)).toHaveBeenCalledWith({ loading: false });
  });

  it('should show success notification on successful update', async () => {
    // This test ensures a success notification is shown.
    const id = 2;
    const status = 'APPROVED';
    const action = { id, status } as UpdateWithdrawStatus;

    (mockWithdrawalService.updateWithdrawStatus as any).mockReturnValue({
      pipe: jest.fn().mockReturnValue({
        subscribe: (success: any) => {
          success({ success: true });
        },
      }),
    } as any);

    state.updateWithdrawStatus(ctx as any, action);

    expect(jest.mocked(mockNotificationService.showSuccess)).toHaveBeenCalled();
  });

  // --- Edge Case Tests ---

  it('should handle error from withdrawalService and show error notification', async () => {
    // This test ensures errors are handled and error notification is shown.
    const id = 3;
    const status = 'FAILED';
    const action = { id, status } as UpdateWithdrawStatus;

    const errorObj = { message: 'Update failed' };
    (mockWithdrawalService.updateWithdrawStatus as any).mockReturnValue({
      pipe: jest.fn().mockReturnValue({
        subscribe: (success: any, error: any) => {
          error(errorObj);
        },
      }),
    } as any);

    ctx.patchState = jest.fn();

    state.updateWithdrawStatus(ctx as any, action);

    expect(jest.mocked(mockNotificationService.showError)).toHaveBeenCalledWith(errorObj.message);
    expect(jest.mocked(ctx.patchState)).toHaveBeenCalledWith({ loading: false });
  });

  it('should not break if withdrawalService returns an empty response', async () => {
    // This test ensures the method does not throw if the service returns empty.
    const id = 4;
    const status = 'APPROVED';
    const action = { id, status } as UpdateWithdrawStatus;

    (mockWithdrawalService.updateWithdrawStatus as any).mockReturnValue({
      pipe: jest.fn().mockReturnValue({
        subscribe: (success: any) => {
          success({});
        },
      }),
    } as any);

    ctx.patchState = jest.fn();

    state.updateWithdrawStatus(ctx as any, action);

    expect(jest.mocked(ctx.patchState)).toHaveBeenCalledWith({ response: {} });
    expect(jest.mocked(mockNotificationService.showSuccess)).toHaveBeenCalled();
  });

  it('should handle edge case where id is 0 and status is empty string', async () => {
    // This test ensures the method can handle id=0 and status="".
    const id = 0;
    const status = '';
    const action = { id, status } as UpdateWithdrawStatus;

    (mockWithdrawalService.updateWithdrawStatus as any).mockReturnValue({
      pipe: jest.fn().mockReturnValue({
        subscribe: (success: any) => {
          success({ success: true, id, status });
        },
      }),
    } as any);

    ctx.patchState = jest.fn();

    state.updateWithdrawStatus(ctx as any, action);

    expect(jest.mocked(mockWithdrawalService.updateWithdrawStatus)).toHaveBeenCalledWith(id, status);
    expect(jest.mocked(ctx.patchState)).toHaveBeenCalledWith({ response: { success: true, id, status } });
    expect(jest.mocked(mockNotificationService.showSuccess)).toHaveBeenCalled();
  });

  it('should not call showSuccess if service throws error', async () => {
    // This test ensures showSuccess is not called on error.
    const id = 5;
    const status = 'FAILED';
    const action = { id, status } as UpdateWithdrawStatus;

    (mockWithdrawalService.updateWithdrawStatus as any).mockReturnValue({
      pipe: jest.fn().mockReturnValue({
        subscribe: (success: any, error: any) => {
          error({ message: 'fail' });
        },
      }),
    } as any);

    state.updateWithdrawStatus(ctx as any, action);

    expect(jest.mocked(mockNotificationService.showSuccess)).not.toHaveBeenCalled();
    expect(jest.mocked(mockNotificationService.showError)).toHaveBeenCalled();
  });

  it('should not call patchState with response if service throws error', async () => {
    // This test ensures patchState({response: ...}) is not called on error.
    const id = 6;
    const status = 'FAILED';
    const action = { id, status } as UpdateWithdrawStatus;

    (mockWithdrawalService.updateWithdrawStatus as any).mockReturnValue({
      pipe: jest.fn().mockReturnValue({
        subscribe: (success: any, error: any) => {
          error({ message: 'fail' });
        },
      }),
    } as any);

    ctx.patchState = jest.fn();

    state.updateWithdrawStatus(ctx as any, action);

    // Only loading: false should be patched, not response
    expect(jest.mocked(ctx.patchState)).not.toHaveBeenCalledWith({ response: expect.anything() });
    expect(jest.mocked(ctx.patchState)).toHaveBeenCalledWith({ loading: false });
  });
});