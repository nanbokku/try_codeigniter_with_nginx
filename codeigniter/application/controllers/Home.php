<?php

declare(strict_types=1);

class Home extends CI_Controller
{
    public function __construct()
    {
        parent::__construct();
    }

    public function index()
    {
        $this->load->view('top.html');
    }
}
