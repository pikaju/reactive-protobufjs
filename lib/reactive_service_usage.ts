import $protobuf from 'protobufjs';
import { Observable } from 'rxjs';
import { MethodJson, ServiceJson, ServiceTypeGuard } from './generated_code_types';
import { ClientMetadata, Deadline, InitialServerMetadata, Status } from './grpc_types';
import { CancellationToken } from './utility';

export type ReactiveClientRpcImpl = {
};

export type ReactiveClientConstructor<
  GeneratedServiceJson extends ServiceJson,
  GeneratedServiceType extends typeof $protobuf.rpc.Service & ServiceTypeGuard<GeneratedServiceJson>,
> = {
  new (rpcImpl: ReactiveClientRpcImpl): ReactiveClient<GeneratedServiceJson, GeneratedServiceType>;
};

export type ReactiveClient<
  GeneratedServiceJson extends ServiceJson,
  GeneratedServiceType extends typeof $protobuf.rpc.Service & ServiceTypeGuard<GeneratedServiceJson>,
> = Omit<{
  [K in keyof GeneratedServiceType['prototype']]: ReactiveClientMethod<GeneratedServiceJson['methods'][Capitalize<K & string>], GeneratedServiceType['prototype'][K]>;
}, keyof $protobuf.rpc.Service>;

export type ReactiveClientMethod<GeneratedMethodJson extends MethodJson, GeneratedMethodType extends ((...args: never[]) => void)> = GeneratedMethodType extends ((request: infer RequestType) => Promise<infer ResponseType>)
  ? GeneratedMethodJson extends { requestStream: boolean }
    ? (GeneratedMethodJson extends { responseStream: boolean } ? ReactiveBidirectionalStreamClientMethod<RequestType, ResponseType> : ReactiveRequestStreamClientMethod<RequestType, ResponseType>)
    : (GeneratedMethodJson extends { responseStream: boolean } ? ReactiveResponseStreamClientMethod<RequestType, ResponseType> : ReactiveUnaryClientMethod<RequestType, ResponseType>)
  : never;

type PromiseOr<T> = Promise<T> | T;

type GenericArguments<T extends Promise<unknown> | Observable<unknown>> = [
  request: T extends Promise<infer RequestType> ? PromiseOr<RequestType> : T,
  metadata?: ClientMetadata,
  deadline?: Deadline,
];

type GenericReturnType<T extends Promise<unknown> | Observable<unknown>> = {
  cancellationToken: CancellationToken;
  initialMetadata: Promise<InitialServerMetadata>;
  status: Promise<Status>;
  response: T;
};

export type ReactiveUnaryClientMethod<RequestType, ResponseType> = (...args: GenericArguments<Promise<RequestType>>) => GenericReturnType<Promise<ResponseType>>;
export type ReactiveRequestStreamClientMethod<RequestType, ResponseType> = (...args: GenericArguments<Observable<RequestType>>) => GenericReturnType<Promise<ResponseType>>;
export type ReactiveResponseStreamClientMethod<RequestType, ResponseType> = (...args: GenericArguments<Promise<RequestType>>) => GenericReturnType<Observable<ResponseType>>;
export type ReactiveBidirectionalStreamClientMethod<RequestType, ResponseType> = (...args: GenericArguments<Observable<RequestType>>) => GenericReturnType<Observable<ResponseType>>;

export function makeReactiveClientConstructor<
  GeneratedServiceJson extends ServiceJson,
  GeneratedServiceType extends typeof $protobuf.rpc.Service & ServiceTypeGuard<GeneratedServiceJson>,
>(
  serviceJson: GeneratedServiceJson,
  serviceType: GeneratedServiceType,
) : ReactiveClientConstructor<GeneratedServiceJson, GeneratedServiceType> {
  // Create the base class for the client.
  const clientConstructor = class {
    constructor(rpcImpl: ReactiveClientRpcImpl) {
      this.#rpcImpl = rpcImpl;
    }
    #rpcImpl: ReactiveClientRpcImpl;
    [K: string]: (...args: never[]) => unknown;
  };

  // Add implementations for all RPC methods.
  for (const method of Object.keys(serviceJson['methods'])) {
    const { requestStream, responseStream } = serviceJson['methods'][method];

    type IgnoreRequestResponse = Promise<unknown> | Observable<unknown>;
    clientConstructor.prototype[method] = async (...[request, metadata, deadline]: GenericArguments<IgnoreRequestResponse>): GenericReturnType<IgnoreRequestResponse> => {
      const cancellationToken = new CancellationToken();
      return {
        cancellationToken,
        
      };
    };
  }

  return clientConstructor as unknown as ReactiveClientConstructor<GeneratedServiceJson, GeneratedServiceType>;
}
