/**
 * messages
 *
 * Created by Peter Whitehead March 2020
 *
 * Baseline application that serves an API and basic web pages
 *
 * Copyright Peter Whitehead @2020
 *
 * Licensed under Apache-2.0
 *
 */
'use strict';


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
    does_not_exist:'Does not exist',
    already_exists: 'Already exists',
    callback_not_a_function: 'Callback is not a function',
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
        cannot_delete_object: 'Cannot delete object: ',
        failure_to_save_db: 'Failure to save database document'

    },
    environment:{
        invalid_deployment: 'Invalid deployment: ',
        mandatory_environment_variables_missing: 'Mandatory environment variables are missing: '
    },
    config:{
        updated: 'Config was updated',
        was_not_updated: 'Config was not updated: ',
        invalid_logLevel: 'The value of logLevel is not valid: ',
        objects_undefined: 'Either doc or body is not an object',
        invalid_data: 'The data requested for update is not valid',
        cannot_update_database: 'Was unable to update the database document',
        create_new_config: 'Create new config object'
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

    },
    mqlight:{
        initial_msg: 'mqlight started',
        received_message: 'mqlight: recieived: ',
        sent_message: 'mqlight: sent: ',
        subscribed_to: 'mqlight: subscribed to: ',
        to_topic: ' to topic: '
    }

};

module.exports.messages = messages;