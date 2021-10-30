import $protobuf from 'protobufjs';
import { Observable } from 'rxjs';
import { MethodJson, ServiceJson, ServiceTypeGuard } from './generated_code_types';
import { ClientMetadata, Deadline, InitialServerMetadata, Status } from './grpc_types';
import { CancellationToken } from './utility';

export type ReactiveService<
  GeneratedServiceJson extends ServiceJson,
  GeneratedServiceType extends typeof $protobuf.rpc.Service & ServiceTypeGuard<GeneratedServiceJson>,
> = Omit<{
  [K in keyof GeneratedServiceType['prototype']]: ReactiveServiceMethod<GeneratedServiceJson['methods'][Capitalize<K & string>], GeneratedServiceType['prototype'][K]>;
}, keyof $protobuf.rpc.Service>;

export type ReactiveServiceMethod<GeneratedMethodJson extends MethodJson, GeneratedMethodType extends ((...args: never[]) => void)> = GeneratedMethodType extends ((request: infer RequestType) => Promise<infer ResponseType>)
  ? GeneratedMethodJson extends { requestStream: boolean }
    ? (GeneratedMethodJson extends { responseStream: boolean } ? ReactiveBidirectionalStreamServiceMethod<RequestType, ResponseType> : ReactiveRequestStreamServiceMethod<RequestType, ResponseType>)
    : (GeneratedMethodJson extends { responseStream: boolean } ? ReactiveResponseStreamServiceMethod<RequestType, ResponseType> : ReactiveUnaryServiceMethod<RequestType, ResponseType>)
  : never;

type GenericArguments<T extends Promise<unknown> | Observable<unknown>> = [
  request: T,
  metadata: ClientMetadata,
  deadline: Deadline,
  cancellationToken: CancellationToken
];

type PromiseOr<T> = Promise<T> | T;

type SimpleResponseReturnType<T extends Promise<unknown> | Observable<unknown>> = T extends Promise<infer ResponseType>
  ? PromiseOr<{ status: Status; response: ResponseType }>
  : (T extends Observable<infer ResponseType> ? Observable<Status | ResponseType> : never);

type GenericReturnType<T extends Promise<unknown> | Observable<unknown>> = PromiseOr<{
  initialMetadata: InitialServerMetadata,
  result: SimpleResponseReturnType<T>,
}> | SimpleResponseReturnType<T>;

export type ReactiveUnaryServiceMethod<RequestType, ResponseType> = (...args: GenericArguments<Promise<RequestType>>) => GenericReturnType<Promise<ResponseType>>;
export type ReactiveRequestStreamServiceMethod<RequestType, ResponseType> = (...args: GenericArguments<Observable<RequestType>>) => GenericReturnType<Promise<ResponseType>>;
export type ReactiveResponseStreamServiceMethod<RequestType, ResponseType> = (...args: GenericArguments<Promise<RequestType>>) => GenericReturnType<Observable<ResponseType>>;
export type ReactiveBidirectionalStreamServiceMethod<RequestType, ResponseType> = (...args: GenericArguments<Observable<RequestType>>) => GenericReturnType<Observable<ResponseType>>;
