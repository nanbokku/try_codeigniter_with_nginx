<?php

declare(strict_types=1);

class Todomvc extends CI_Controller
{
    public function __construct()
    {
        parent::__construct();

        $this->load->model('Todo_model', 'todoModel');
    }

    public function _remap($method, $params = [])
    {
        if ($method === 'todos') {
            $requestMethod = strtolower($this->input->server('REQUEST_METHOD'));
            $this->{$requestMethod}($params);
        }
    }

    public function index()
    {
        if (!$this->input->is_ajax_request()) {
            $this->output->set_status_header(404, 'Not Found');
        }
    }

    public function get($params)
    {
        if (count($params) !== 1) {
            $this->output->set_status_header(400, 'Bad Request');

            return;
        }

        if ((int) ($params[0])) {
            $id = (int) ($params[0]);
            $result = $this->todoModel->fetchById($id);

            $this->output->set_header('Content-Type:application/json;charset=utf-8');
            $this->output->set_output(json_encode($result));

            return;
        } elseif ($params[0] === 'all') {
            $result = $this->todoModel->fetchAll();

            $this->output->set_header('Content-Type:application/json;charset=utf-8');
            $this->output->set_output(json_encode($result));

            return;
        }

        $this->output->set_status_header(400, 'Bad Request');
    }

    public function post($params = [])
    {
        $data = json_decode($this->input->raw_input_stream, true);
        $contents = $data['contents'];
        $id = $this->todoModel->add($contents);

        $this->output->set_header('Content-Type:application/json;charset=utf-8');
        $this->output->set_output($id);
    }

    public function put($params)
    {
        if (count($params) !== 1) {
            $this->output->set_status_header(400, 'Bad Request');

            return;
        }

        $id = (int) ($params[0]);
        $data = json_decode($this->input->raw_input_stream, true);
        $this->todoModel->update($id, $data);
    }
}
