import { LoaderFunctionArgs, ActionFunctionArgs, ClientLoaderFunctionArgs, ClientActionFunctionArgs } from 'react-router';

type AllDataFunctionArgs = LoaderFunctionArgs | ActionFunctionArgs | ClientLoaderFunctionArgs | ClientActionFunctionArgs;

declare const withLoaderContextWrapper: (loader: <T>(args: LoaderFunctionArgs) => T, id: string) => (args: AllDataFunctionArgs) => Promise<unknown>;
declare const withActionContextWrapper: (action: <T>(args: ActionFunctionArgs) => T, id: string) => (args: AllDataFunctionArgs) => Promise<unknown>;
declare const withClientLoaderContextWrapper: (loader: <T>(args: ClientLoaderFunctionArgs) => T, id: string) => (args: AllDataFunctionArgs) => Promise<unknown>;
declare const withClientActionContextWrapper: (action: <T>(args: ClientActionFunctionArgs) => T, id: string) => (args: AllDataFunctionArgs) => Promise<unknown>;

export { withActionContextWrapper, withClientActionContextWrapper, withClientLoaderContextWrapper, withLoaderContextWrapper };
