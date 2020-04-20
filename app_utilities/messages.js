


const messages = {
    started: 'Started',
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
    req_params_not_found: 'Request paramaters not found: ',
    cannot_parse_JSON_file: 'Cannot parse file to JSON',
    no_res_json: 'No response JSON defined',
    http_response_sent: 'HTTP response sent with status: ',
    error: 'Error: ',
    api:{
        good_status: 'Sending good status',
        cannot_find_test_files: 'Cannot find the test files ',
        object_undefined: 'Object has not been found: ',
    },
    mongo:{
        dummy_error: 'Dummy error',
        cannot_find_object: 'Cannot find the mongo project: ',
        object_exists: 'Mongo object already exists: ',
        cannot_get_model: 'Cannot get a model',
        invalid_doc_length: 'Document does not contain the expected number of elements: doc.length = ',
        connection_error_retry: 'Cannot connect to : ',
        typeof_plugin_error: 'The update plugin is not a function',
        object_created: 'Successful config creation',
        invalid_id: 'Configid is not valid',
        created_model: 'Created Mongoose model: ',
        cannot_delete_object: "Cannot delete object: "

    },
    environment:{
        invalid_deployment: 'Invalid deployment: ',
        mandatory_environment_variables_missing: 'Mandatory environment variables are missing: '
    },
    config:{
        config_updated: 'Config was updated',
        config_was_not_updated: 'Config was not updated: ',
        config_invalid_logLevel: 'The value of logLevel is not valid: ',
        config_doc_logLevel_undefined: 'The field doc.logLevel in req.body is not defined',
        config_invalid_data: 'The data requested for update is not valid'
    },
    basic: {
       child_process_error: 'The child process exited with error: ',
       child_process_completed: 'The child process has completed'
    },
    db: {
        connected_to: 'Connected to: ',
        disconnected_from: 'Disconnected from: ',
        connecting_to: 'Connecting to: ',
        reconnecting_to: 'Reconnecting to: ',
        create_config: 'Create initial config in db',
        create_config_error: 'Error creating applicaiton configuration: ',
        connection_error_retry: 'Cannot connect: Retry attempts: ',
        closed_connection: 'Closed connection with: ',
        not_available: 'DB is not available'

    }

};

module.exports.messages = messages;