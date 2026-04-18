// For more information about this file see https://dove.feathersjs.com/guides/cli/service.html
import { authenticate } from '@feathersjs/authentication'

import { hooks as schemaHooks } from '@feathersjs/schema'

import {
  testDataValidator,
  testPatchValidator,
  testQueryValidator,
  testResolver,
  testExternalResolver,
  testDataResolver,
  testPatchResolver,
  testQueryResolver,
  testValidator,
 } from './test.schema'

import type { Application } from '../../declarations'
import { TestService, getOptions } from './test.class'
import { testPath, testMethods } from './test.shared'

export * from './test.class'
export * from './test.schema'

// A configure function that registers the service and its hooks via `app.configure`
export const test = (app: Application) => {
  // Register our service on the Feathers application
  app.use(testPath, new TestService(getOptions(app)), {
    // A list of all methods this service exposes externally
    methods: testMethods,
    // You can add additional custom events to be sent to clients here
    events: []
  })
  // Initialize hooks
  app.service(testPath).hooks({
    around: {
      all: [
        authenticate('jwt'),
        schemaHooks.resolveExternal(testExternalResolver),
        schemaHooks.resolveResult(testResolver)
      ]
    },
    before: {
      all: [schemaHooks.validateQuery(testQueryValidator), schemaHooks.resolveQuery(testQueryResolver)],
      find: [],
      get: [],
      create: [
          schemaHooks.resolveData(testDataResolver),
        schemaHooks.validateData(testValidator)
 
      ],
      patch: [schemaHooks.validateData(testPatchValidator), schemaHooks.resolveData(testPatchResolver)],
      remove: []
    },
    after: {
      all: []
    },
    error: {
      all: []
    }
  })
}

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    [testPath]: TestService
  }
}
