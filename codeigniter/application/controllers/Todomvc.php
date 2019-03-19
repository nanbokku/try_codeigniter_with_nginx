<?php

declare(strict_types=1);

class Todomvc extends CI_Controller
{
    public function __construct()
    {
        parent::__construct();

        $this->load->model('Todo_model', 'todoModel');
    }

    public function __remap($method, $params = [])
    {
        if ($method === 'todos') {
            $requestMethod = strtolower($this->input->server('REQUEST_METHOD'));
            $this->{$method}($params);
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
        $contents = (string) $this->input->input_stream('contents');
        $this->model->add($contents);
    }

    public function put($params)
    {
        if (count($params) !== 1) {
            $this->output->set_status_header(400, 'Bad Request');

            return;
        }

        $id = (int) ($params[0]);
        $data = json_decode($this->input->raw_input_stream());
        $this->model->update($id, $data);
    }
}
