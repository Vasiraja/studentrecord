// For more information about this file see https://dove.feathersjs.com/guides/cli/service.shared.html
import type { Params } from '@feathersjs/feathers'
import type { ClientApplication } from '../../client'
import type { Test, TestData, TestPatch, TestQuery, TestService } from './test.class'

export type { Test, TestData, TestPatch, TestQuery }

export type TestClientService = Pick<TestService<Params<TestQuery>>, (typeof testMethods)[number]>

export const testPath = 'test'

export const testMethods: Array<keyof TestService> = ['find', 'get', 'create', 'patch', 'remove']

export const testClient = (client: ClientApplication) => {
  const connection = client.get('connection')

  client.use(testPath, connection.service(testPath), {
    methods: testMethods
  })
}

// Add this service to the client service type index
declare module '../../client' {
  interface ServiceTypes {
    [testPath]: TestClientService
  }
}
