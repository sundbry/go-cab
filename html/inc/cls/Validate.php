<?php

class Validate {

	private $rules = array(), $errors = array(), $values = null;

	public function __construct($rules = array()) {
		$this->rules = $rules;
	}

	public function addRules(array $rules) {
		$this->rules = array_merge($this->rules, $rules);
	}

	public function errors() {
		return $this->errors;
	}

	public function errorsList() {
		$list = array();
		foreach($this->errors as $errs) {
			foreach($errs as $err) {
				array_push($list, $err);
			}
		}
		return $list;
	}

	public function firstErrorMessage() {
		if(!empty($this->errors)) {
			return reset(reset($this->errors));
		}
		return false;
	}

	public function hasError() {
		return !empty($this->errors);
	}

	public function run($values) {
		$this->values = $values;
		foreach($this->rules as $field => $rules) {
			if(is_array($rules)) {
				foreach($rules as $rule) {
					$this->runRule($field, $rule);
				}
			}
			elseif($rules instanceof VRule) {
				$this->runRule($field, $rules);	
			}
			else {
				throw new Exception("Invalid rule form");
			}
		}
		return empty($this->errors);
	}

	private function runRule($field, VRule $rule) {
		if(!$rule->test($this->values[$field])) {
			$this->errors[$field][] = $rule->errorMessage();
			return false;
		}
		return true;
	}

}

?>
