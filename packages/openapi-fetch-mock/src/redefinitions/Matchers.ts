// ======================================================
// == THIS FILE redefines types of fetch-mock/Route.ts ==
// ======================================================

/*
ORIGINAL from fetch-mock:

    export type URLMatcherObject = {
        begin?: string;
        end?: string;
        include?: string;
        glob?: string;
        express?: string;
        host?: string;
        path?: string;
        regexp?: RegExp;
    };
    export type RouteMatcherUrl = string | RegExp | URL | URLMatcherObject;
    export type RouteMatcherFunction = (callLog: CallLog) => boolean;
    type MatcherGenerator = (route: RouteConfig) => RouteMatcherFunction;
    export type RouteMatcher = RouteMatcherUrl | RouteMatcherFunction;
    export type MatcherDefinition = {
        name: string;
        matcher: MatcherGenerator;
        usesBody?: boolean;
    };

EXPLANATIONS for the typed redefinitions:

    To infer the correct openapi operation, we require the complete path to be present in the matcher and to be inferable
    via the type system. We therefore, can only allow the 'path' matcher and url matcher in the form of a string.

    The disallowed matching options include the custom matcher definitions, as they are completely runtime-based, and no
    openapi operation can be inferred.

    TODO Does it even make sense to use this part of the API?
 */
export type URLMatcherObject<PATH> = {
  path: PATH;
};

export type RouteMatcherUrl<PATH extends string> = PATH | URLMatcherObject<PATH>;
