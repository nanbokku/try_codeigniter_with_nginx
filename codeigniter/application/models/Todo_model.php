<?php

declare(strict_types=1);

class Todo_model extends CI_Model
{
    public function __construct()
    {
        parent::__construct();

        $this->load->database('todo_database', false, true);
    }

    public function fetchById($id)
    {
        if (!isset($id)) {
            throw new Exception('argument is unset in ' + __METHOD__);
        }

        $data = $this->db->select('*')->from('todos')->where('id', $id)->get();

        return $data->row_array();
    }

    public function fetchAll()
    {
        $data = $this->db->get('todos');

        return $data->result_array();
    }

    public function add($contents)
    {
        $this->db->set('contents', $contents)->insert('todos');

        return $this->db->insert_id();
    }

    public function update($id, $data)
    {
        $this->db->set($data)->where('id', $id)->update('todos');
    }
}
