import $protobuf from 'protobufjs';
import { endWith, map, Observable } from 'rxjs';
import { makeReactiveServiceConstructor, ReactiveService, ReactiveServiceConstructor } from './reactive_service_definition';
import { ServiceJson, ServiceTypeGuard } from './generated_code_types';

import { example } from './generated';
import jsonDeclaration from './generated/declaration.json';
import { makeReactiveClientConstructor } from './reactive_service_usage';
import { ClientMetadata, Deadline, InitialServerMetadata, Status } from './grpc_types';
import { CancellationToken } from './utility';

const serviceJson = jsonDeclaration.nested.example.nested.Example;

const service = new ExampleService();

class ExampleService implements ReactiveService<typeof serviceJson, typeof example.Example> {
  public async performUnaryRequest(request: Promise<example.ITestRequest>, metadata: ClientMetadata, deadline: Deadline, cancellationToken: CancellationToken): ({ initialMetadata: InitialServerMetadata; result: Promise<{ status: Status; response: example.TestResponse; }>; } | Promise<{ initialMetadata: InitialServerMetadata; result: Promise<{ status: Status; response: example.TestResponse; }>; }>) | Promise<{ status: Status; response: example.TestResponse; }> {
    cancellationToken.cancel();
    return {
      response: example.TestResponse.create({ value: 'hi' }),
      status: new Status(Status.Code.OK, 'message'),
    }
  }
  public performClientStreamRequest(request: Observable<example.ITestRequest>, metadata: ClientMetadata, deadline: Deadline, cancellationToken: CancellationToken): ({ initialMetadata: InitialServerMetadata; result: Promise<{ status: Status; response: example.TestResponse; }>; } | Promise<{ initialMetadata: InitialServerMetadata; result: Promise<{ status: Status; response: example.TestResponse; }>; }>) | Promise<{ status: Status; response: example.TestResponse; }>;
  public performClientStreamRequest(request: example.ITestRequest): Promise<example.TestResponse> {
    throw new Error('Method not implemented.');
  }
  public performServerStreamRequest(request: Promise<example.ITestRequest>, metadata: ClientMetadata, deadline: Deadline, cancellationToken: CancellationToken): ({ initialMetadata: InitialServerMetadata; result: Observable<example.TestResponse | Status>; } | Promise<{ initialMetadata: InitialServerMetadata; result: Observable<example.TestResponse | Status>; }>) | Observable<example.TestResponse | Status>;
  public performServerStreamRequest(request: example.ITestRequest): Promise<example.TestResponse> {
    throw new Error('Method not implemented.');
  }
  public performBidiStreamRequest(request: Observable<example.ITestRequest>, metadata: ClientMetadata, deadline: Deadline, cancellationToken: CancellationToken): ({ initialMetadata: InitialServerMetadata; result: Observable<example.TestResponse | Status>; } | Promise<{ initialMetadata: InitialServerMetadata; result: Observable<example.TestResponse | Status>; }>) | Observable<example.TestResponse | Status> {
    return request.pipe(map((request) => example.TestResponse.create({ value: `${request.value}` })), endWith(new Status(Status.Code.OK, 'kdfj')));
  }
}

const ExampleClient = makeReactiveClientConstructor(serviceJson, example.Example);
const client = new ExampleClient();

client.
