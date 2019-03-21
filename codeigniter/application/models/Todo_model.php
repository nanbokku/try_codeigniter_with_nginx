<?php

declare(strict_types=1);

class Todo_model extends CI_Model
{
    public function __construct()
    {
        parent::__construct();

        $this->load->database('todo', false, true);
    }

    public function fetchById($id)
    {
        if (!isset($id)) {
            throw new Exception('argument is unset in ' + __METHOD__);
        }

        $result = $this->db->select('*')->from('todos')->where('id', $id)->get();

        $data = $result->row_array();

        return $this->convert($data);
    }

    public function fetchAll()
    {
        $result = $this->db->get('todos');

        $data = $result->result_array();
        foreach ($data as &$row) {
            $row = $this->convert($row);
        }
        unset($row);

        return $data;
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

    // 全て string 型になっているので必要に応じて型変換を行う
    private function convert($data)
    {
        foreach ($data as $key => &$val) {
            if ($key === 'id') {
                $val = (int) $val;
                continue;
            }
            if ($key === 'completed') {
                $val = $val === '0' ? false : true;
            }
        }
        unset($val);    // $val の参照を切る

        return $data;
    }
}
