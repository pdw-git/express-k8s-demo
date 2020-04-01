


const messages = {

    parameter_check_error: 'Error with parameter(s)',
    send_status: 'Sending response',
    send_status_record_deleted: 'Document deleted',
    status_confirm_deletion: 'Document deleted',
    rendering_page: 'Rendering page',
    error_in_response: 'Error in response message',
    unexpected_status: 'Unexpected status',
    no_req_body: 'No request body',
    request_failure: 'Request operation failed',
    production_error: 'Apologies, something unexpected happened in the application',
    page_not_found: 'Appologies, the page you are looking for was not found',
    config_file_undefined: 'The application configuration JSON file has not been defined or is missing',
    http_configuration_error: 'Error configuring the http/https server',
    https_cert_provider: 'Certificate provider: ',
    http_server_creation_error: 'Error creating server [http/https]',
    api:{
        good_status: 'Sending good status',
        cannot_find_test_files: 'Cannot find the test files ',
        object_undefined: 'Object has not been found: '
    },
    mongo:{
        dummy_error: 'dummy error',
        cannot_find_object: 'Cannot find the mongo project: ',
        object_exists: 'mongo object already exists: ',
        cannot_get_model: 'Cannot get a model'
    },
    environment:{
        invalid_deployment: 'Invalid deployment: ',
        mandatory_environment_variables_missing: 'mandatory environment variables are missing: '
    }

};

module.exports.messages = messages;