<template>
    <el-form :model="form" label-width="80px" style="width: 400px;">
      <el-form-item label="用户名">
        <el-input v-model="form.username" placeholder="请输入用户名"></el-input>
      </el-form-item>
  
      <el-form-item label="密码">
        <el-input v-model="form.password" type="password" placeholder="请输入密码"></el-input>
      </el-form-item>
  
      <el-form-item>
        <el-button type="primary" @click="onSubmit">提交</el-button>
        <el-button @click="onReset">重置</el-button>
      </el-form-item>
    </el-form>
  </template>
  
  <script>
  export default {
    name: 'simpleForm',
    data() {
      return {
        form: {
          username: '',
          password: ''
        }
      };
    },
    methods: {
      onSubmit() {
        console.log('提交的数据：', this.form);
        this.$message.success('提交成功');
      },
      onReset() {
        this.form.username = '';
        this.form.password = '';
      }
    }
  };
  </script>
  