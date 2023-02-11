<template>
  <div class="hello">
    <h2>DMC Wallet Generator</h2>
    <p class="warning">DO NOT use this tool to corrupt the DMC blockchain.</p>
    <hr>

    <div class="form-group">
      <p>
        <span class="pb-2 block">Account: ( You can Enter a standard account / a prefix within 4 alphanumeric characters / leave it blank)</span>
        <input type="text" class="form-control" id="account" placeholder="" v-model="account">
      </p>

      <p>
        <span class="pb-2 block">Total: ( must less than 100)</span>
        <input type="number" class="form-control"  placeholder="Total" v-model="total" max="100" min="1">
      </p>
      
      <button v-if="!creating" :disabled="total==0 || total > 100" type="button" :class="total == 0 || total > 100 ? 'btn-disabled' : 'btn-primary'" class="btn" @click="generateWallet">Generate</button>
      <div v-else-if="creating" type="button" class="btn btn-default" >Generating...</div>

    </div>

    <hr>

    <div v-if="error.length > 0">
      <h3>Error</h3>
      <ul>
        <li class="error" v-for="err in error" :key="err">{{ err }}</li>
      </ul>
    </div>

    <div v-if="results.length > 0">
      <h3>
        Wallet Results : ( {{ results.length }} )
        <button type="button" v-if="!creating" class="ml-2 btn-small btn btn-primary" @click="exportToCsv">Export to CSV</button>
      </h3>
      <span class="warning pb-2 block">DO NOT share your private key with anyone.</span>
      <table class="table table-bordered">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Address</th>
            <th scope="col">Private Key</th>
            <th scope="col">Action</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="result in results" :key="result.account">
            <td>{{ results.indexOf(result) + 1 }}</td>
            <td>{{ result.account }}</td>
            <td>{{ result.privateKey }}</td>
            <td><a :href="'https://explorer.dmctech.io/details/'+result.account" target="_blank">View on Explorer</a></td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>

import { createWallet } from '../wallet'
import { jsontoexcel } from "vue-table-to-excel";

export default {
  name: 'Create',
  data () {
    return {
      account: '',
      total: 1,
      results: [],
      creating: false,
      error: []
    }
  },
  methods: {
     generateWallet: async function () {
        this.error = []

        if (this.total > 100) {
            this.error.push('Total must less than 100')
            return
        }

        this.creating = true
        this.results = []
        for (let i = 0; i < this.total; i++) {
          let wallet = await createWallet(this.account).catch(err => {
              this.error.push(err.message);
          })
          if (!wallet) {
            continue
          }
          
          this.results.push(wallet)
        }
        this.creating = false
    },

    exportToCsv: function () {
      //jsontoexcel
      var heads = ['account', 'privateKey','publicKey'];
      var filename = 'DMC_Wallets_' + new Date().toLocaleDateString() + '.csv';
      jsontoexcel.getXlsx(this.results, heads, filename); 
    }
  }
}
</script>

<style scoped>
.warning {
  color: rgb(159, 135, 14);
  font-weight: bold;
}

.pb-2 {
  padding-bottom: 0.5rem;
}

.error {
  color: red;
}

.block {
  display: block;
}

.form-group {
  margin-top: 20px;
  
}

.form-control {
  display: block;
  width: 100%;
  padding: 0.375rem 0.75rem;
  font-size: 1rem;
  line-height: 1.5;
  color: #495057;
  background-color: #fff;
  background-clip: padding-box;
  border: 1px solid #ced4da;
  border-radius: 0.25rem;
  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
}

.ml-2 {
  margin-left: 0.5rem;
}


.hello {
  text-align: left!important;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 20px;
  padding: 0 20px;
}

.form-group {
  margin-bottom: 20px;
}

.btn {
  display: inline-block;
  font-weight: 400;
  color: #212529;
  text-align: center;
  vertical-align: middle;
  user-select: none;
  background-color: transparent;
  border: 1px solid transparent;
  padding: 0.375rem 0.75rem;
  font-size: 1rem;
  line-height: 1.5;
  border-radius: 0.25rem;
  transition: color 0.15s ease-in-out, background-color 0.15s ease-in-out, border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
}

.btn-primary {
  color: #fff;
  background-color: #007bff;
  border-color: #007bff;
}
.btn-default {
  color: #212529;
  background-color: #fff;
  border-color: #ced4da;
}

.btn-small {
  padding: 0.25rem 0.5rem!important;
  font-size: 0.875rem!important;
  line-height: 1.5!important;
  border-radius: 0.2rem!important;
}

.btn-disabled {
  color: #6c6d6d;
  background-color: #d6d6d6;
  border-color: #ced4da;
  cursor: not-allowed;
}

table.table {
  width: 100%;
  max-width: 100%;
  margin-bottom: 1rem;
  background-color: transparent;
}

table.table-bordered {
  border: 1px solid #dee2e6;
}

table.table-bordered th,
table.table-bordered td {
  padding: 0.5rem;
  border: 1px solid #dee2e6;
}

</style>
