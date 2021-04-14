import { ApolloServerPlugin } from 'apollo-server-plugin-base';
import { Counter, Histogram, Registry } from 'prom-client';

// inspired from apollo-metrics
export default function createMetricsPlugin(register: Registry): ApolloServerPlugin {
  const parsed = new Counter({
    name: 'graphql_queries_parsed',
    help: 'The amount of GraphQL queries that have been parsed.',
    labelNames: ['operationName', 'operation'],
    registers: [register],
  });

  const validationStarted = new Counter({
    name: 'graphql_queries_validation_started',
    help: 'The amount of GraphQL queries that have started validation.',
    labelNames: ['operationName', 'operation'],
    registers: [register],
  });

  const resolved = new Counter({
    name: 'graphql_queries_resolved',
    help: 'The amount of GraphQL queries that have had their operation resolved.',
    labelNames: ['operationName', 'operation'],
    registers: [register],
  });

  const startedExecuting = new Counter({
    name: 'graphql_queries_execution_started',
    help: 'The amount of GraphQL queries that have started executing.',
    labelNames: ['operationName', 'operation'],
    registers: [register],
  });

  const encounteredErrors = new Counter({
    name: 'graphql_queries_errored',
    help: 'The amount of GraphQL queries that have encountered errors.',
    labelNames: ['operationName', 'operation'],
    registers: [register],
  });

  const responded = new Counter({
    name: 'graphql_queries_responded',
    help:
      'The amount of GraphQL queries that have been executed and been attempted to send to the client. This includes requests with errors.',
    labelNames: ['operationName', 'operation'],
    registers: [register],
  });

  const resolverTime = new Histogram({
    name: 'graphql_resolver_time',
    help: 'The time to resolve a GraphQL field.',
    labelNames: ['parentType', 'fieldName', 'returnType'],
    registers: [register],
  });

  const captureCallDuration = new Histogram({
    name: 'graphql_total_request_time',
    help: 'The time to complete a GraphQL query.',
    labelNames: ['operationName', 'operation'],
    buckets: [0.2, 0.7, 3, 5, 7, 10, 15, 25],
    registers: [register],
  });

  return {
    requestDidStart() {
      const end = captureCallDuration.startTimer();
      return {
        parsingDidStart(parsingContext) {
          parsed.inc({
            operationName: parsingContext.request.operationName || '',
            operation: parsingContext.operation?.operation,
          });
        },
        validationDidStart(validationContext) {
          validationStarted.inc({
            operationName: validationContext.request.operationName || '',
            operation: validationContext.operation?.operation,
          });
        },
        didResolveOperation(resolveContext) {
          resolved.inc({
            operationName: resolveContext.request.operationName || '',
            operation: resolveContext.operation.operation,
          });
        },
        executionDidStart(executingContext) {
          startedExecuting.inc({
            operationName: executingContext.request.operationName || '',
            operation: executingContext.operation.operation,
          });
          return {
            willResolveField({ source, args, context, info }) {
              const capture = resolverTime.startTimer();
              return () => {
                capture({
                  parentType: info.parentType.toString(),
                  fieldName: info.fieldName,
                  returnType: info.returnType.toString(),
                });
              };
            },
          };
        },
        didEncounterErrors(errorContext) {
          encounteredErrors.inc({
            operationName: errorContext.request.operationName || '',
            operation: errorContext.operation?.operation,
          });
        },
        willSendResponse(responseContext) {
          const labels = {
            operationName: responseContext.request.operationName || '',
            operation: responseContext.operation?.operation,
          };
          responded.inc(labels);
          end(labels);
        },
      };
    },
  };
}
