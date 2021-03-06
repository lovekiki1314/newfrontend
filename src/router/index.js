import Vue from 'vue'
import Router from 'vue-router'
import home from '../pages/home/home'
import singleChainAnalysis from '../pages/singleChainAnalysis/singleChainAnalysis'
import graphAnalysis from '../pages/graphAnalysis/graphAnalysis'
import realvirtuetx from '../pages/realvirtuetx/realvirtuetx'
import fuzzyshow from '../pages/realvirtuetx/fuzzyshow'
import Btc from '../pages/singleChainAnalysis/Btc/Btc'
import Eos from '../pages/singleChainAnalysis/Eos/Eos'
import Eth from '../pages/singleChainAnalysis/Eth/Eth'
import btcAddressQuery from '../pages/singleChainAnalysis/Btc/BtcDataQuery/addressQuery'
import btcBlockQuery from '../pages/singleChainAnalysis/Btc/BtcDataQuery/blockQuery'
import btcTransactionQuery from '../pages/singleChainAnalysis/Btc/BtcDataQuery/transactionQuery'
import multiChainAnalysis from '../pages/multiChainAnalysis/multiChainAnalysis'
import eosBlockQuery from '../pages/singleChainAnalysis/Eos/EosDataQuery/EosBlockQuery'
import eosAddressQuery from '../pages/singleChainAnalysis/Eos/EosDataQuery/EosAddressQuery'
import eosTransactionQuery from '../pages/singleChainAnalysis/Eos/EosDataQuery/EosTransactionQuery'
import btc_TXC from '../pages/singleChainAnalysis/Btc/BtcDevelopmentTab/Btc_TXC'
import btc_BKC from '../pages/singleChainAnalysis/Btc/BtcDevelopmentTab/Btc_BKC'
import btc_NAC from '../pages/singleChainAnalysis/Btc/BtcDevelopmentTab/Btc_NAC'
import btc_BD from '../pages/singleChainAnalysis/Btc/BtcSpengding/Btc_BD'
import btc_HP from '../pages/singleChainAnalysis/Btc/BtcSpengding/Btc_HP'
import btc_MF from '../pages/singleChainAnalysis/Btc/BtcSpengding/Btc_MF'
import btcSingleCluster from '../pages/singleChainAnalysis/Btc/BtcCluster/singleCluster'
import data_management from '../pages/data_managent/data_management'
import userCenter from '../pages/user/userCenter'
import userFinishedTask from '../pages/user/userFinishedTask'
import ethBlockQuery from '../pages/singleChainAnalysis/Eth/EthDataQuery/blockQuery'
import ethAddressQuery from '../pages/singleChainAnalysis/Eth/EthDataQuery/addressQuery'
import ethTransactionQuery from '../pages/singleChainAnalysis/Eth/EthDataQuery/transactionQuery'
import ethInternalTransactionQuery from '../pages/singleChainAnalysis/Eth/EthDataQuery/internaltransactionQuery'
import ethtxvalueQuery from '../pages/singleChainAnalysis/Eth/EthDataQuery/txvalueQuery'
import ethSingleCluster from '../pages/singleChainAnalysis/Eth/EthCluster/ethSingleCluster'
import userUnfinishedTask from "../pages/user/userUnfinishedTask"
import communityAnalysis from '../pages/singleChainAnalysis/Btc/BtcDataAnalysis/communityAnalysis'
import illegalActivityAnalysis from '../pages/singleChainAnalysis/Btc/BtcDataAnalysis/illegalActivitiyAnalysis'
import TrackingModel from '../pages/singleChainAnalysis/Btc/BtcDataAnalysis/TrackingModel'
import login from '../pages/login/Login'
import register from '../pages/login/Registered'
import changepwd from '../pages/login/changepwd'
import EosBlockChart from '../pages/singleChainAnalysis/Eos/EosDevelopmentTab/Eos_block'
import EosTransactionChart from '../pages/singleChainAnalysis/Eos/EosDevelopmentTab/Eos_transaction'
import EosSourceChart from '../pages/singleChainAnalysis/Eos/EosDevelopmentTab/Eos_source'
import EosPriceChart from '../pages/singleChainAnalysis/Eos/EosDevelopmentTab/Eos_price'
import EthBlockChart from '../pages/singleChainAnalysis/Eth/EthDevelopmentTab/EthBlock'
import eosActive from '../pages/singleChainAnalysis/Eos/EosDataQuery/EosActive'
import ethGas from '../pages/singleChainAnalysis/Eth/EthDevelopmentTab/EthGas'
import ethPrice from '../pages/singleChainAnalysis/Eth/EthDevelopmentTab/EthPrice'
import ethTransaction from '../pages/singleChainAnalysis/Eth/EthDevelopmentTab/EthTransaction'
import communityGraph from '../pages/singleChainAnalysis/Btc/BtcDataAnalysis/communityGraph';
import illegalGraph from '../pages/singleChainAnalysis/Btc/BtcDataAnalysis/illegalGraph';
import TrackingModelShowing from '../pages/singleChainAnalysis/Btc/BtcDataAnalysis/TrackingModelShowing';
import singleClusterGraph from '../pages/singleChainAnalysis/Btc/BtcCluster/singleClusterGraph';
import about from '../pages/About/about'
import aboutus from '../pages/About/aboutus'
import darknet from '../pages/darknet/data_pre'
import maliciousAddress from '../pages/maliciousAddress/maliciousAddress'
Vue.use(Router)


//????????????????????????push??????
const originalPush = Router.prototype.push
//????????????????????????push??????
Router.prototype.push = function push(location) {
   return originalPush.call(this, location).catch(err => err)
}

export default new Router({
  routes: [
    {
      path: '/',
      redirect:'/home',
    },
   {
     path: '/home',
     name: 'home',
    //  redirect:'/',
     component: home,
   },
   {
     path:'/about',
     name:'about',
     component: about,
     meta:{
      title:'????????????',
    }
   },
   {
    path:'/aboutus',
    name:'aboutus',
    component: aboutus,
    meta:{
     title:'????????????',
   }
  },
   {
     path: '/singleChainAnalysis',
     name: 'singleChainAnalysis',
     component: singleChainAnalysis,
     meta:{
      title:'????????????',
    }
   },
   {
    path: '/darknet',
    name: 'darknet',
    component: darknet,
    meta:{
     title:'????????????',
   }
  },
  {
    path: '/maliciousAddress',
    name: 'maliciousAddress',
    component: maliciousAddress,
    meta:{
     title:'????????????',
   }
  },
   {
     path: '/singleChainAnalysis/Btc',
     name: 'Btc',
     component: Btc,
     meta:{
      title:'????????????',
    }
   },
  {
    path: '/singleChainAnalysis/Btc/btcAddressQuery',
    name: 'btcAddressQuery',
    component: btcAddressQuery,
    meta:{
      title:'????????????',
    }
  },
  {
    path: '/singleChainAnalysis/Btc/btcBlockQuery',
    name: 'btcBlockQuery',
    component: btcBlockQuery,
    meta:{
      title:'????????????',
    }
  },
  {
    path: '/singleChainAnalysis/Btc/btcTransactionQuery',
    name: 'btcTransactionQuery',
    component: btcTransactionQuery,
    meta:{
      title:'????????????',
    }
  },
  {
    path: '/singleChainAnalysis/Btc/BtcDataAnalysis/communityGraph',
    name: communityGraph,
    component: communityGraph,
    meta:{
      title:'????????????',
    }
  },
  {
    path:'/singleChainAnalysis/Btc/BtcDataAnalysis/illegalGraph',
    name:'illegalGraph',
    component:illegalGraph,
    meta:{
      title:'????????????',
    }
  },
  {
    path:'/singleChainAnalysis/Btc/BtcDataAnalysis/TrackingModelShowing',
    name:'TrackingModelShowing',
    component:TrackingModelShowing,
    meta:{
      title:'????????????',
    }
  },
  {
    path:'/singleChainAnalysis/Btc/BtcCluster/singleClusterGraph',
    name:'singleClusterGraph',
    component:singleClusterGraph,
    meta:{
      title:'????????????',
    }
  },
  {
    path: '/multiChainAnalysis',
    name: 'multiChainAnalysis',
    component: multiChainAnalysis,
    meta:{
      title:'????????????',
    }
  },
  {
    path: '/graphAnalysis',
    name: 'graphAnalysis',
    component: graphAnalysis,
    meta:{
      title:'?????????',
    }
  },
  {
    path: '/realvirtuetx',
    name: 'realvirtuetx',
    component: realvirtuetx,
    meta:{
      title:'realvirtuetx',
    }
  },
  {
    path: '/fuzzyshow',
    name: 'fuzzyshow',
    component: fuzzyshow,
    meta:{
      title:'fuzzyshow',
    }
  },
  {
    path: '/singleChainAnalysis/Eos',
    name: 'Eos',
    component: Eos,
    meta:{
      title:'????????????',
    }
  },
  {
    path: '/singleChainAnalysis/Eos/eosBlockQuery',
    name: 'eosBlockQuery',
    component: eosBlockQuery,
    meta:{
      title:'????????????',
    }
  },
  {
    path: '/singleChainAnalysis/Eos/eosAddressQuery',
    name: 'eosAddressQuery',
    component: eosAddressQuery,
    meta:{
      title:'????????????',
    }
  },
  {
    path: '/singleChainAnalysis/Eos/eosTransactionQuery',
    name: 'eosTransactionQuery',
    component:eosTransactionQuery,
    meta:{
      title:'????????????',
    }
  },
  {
    path: '/singleChainAnalysis/Eos/eosActive',
    name: 'eosActive',
    component: eosActive,
    meta:{
      title:'????????????',
    }

  },
  {
    path: '/singleChainAnalysis/Btc/btc_TXC',
    name: 'btc_TXC',
    component: btc_TXC,
    meta:{
      title:'????????????',
    }
  },
  {
    path: '/singleChainAnalysis/Btc/btc_BKC',
    name: 'btc_BKC',
    component: btc_BKC,
    meta:{
      title:'????????????',
    }
  },
  {
    path: '/singleChainAnalysis/Btc/btc_NAC',
    name: 'btc_NAC',
    component: btc_NAC,
    meta:{
      title:'????????????',
    }
  },
  {
    path: '/singleChainAnalysis/Btc/btc_BD',
    name: 'btc_BD',
    component: btc_BD,
    meta:{
      title:'????????????',
    }
  },
  {
    path: '/singleChainAnalysis/Btc/btc_HP',
    name: 'btc_HP',
    component: btc_HP,
    meta:{
      title:'????????????',
    }
  },
  {
    path: '/singleChainAnalysis/Btc/btc_MF',
    name: 'btc_MF',
    component: btc_MF,
    meta:{
      title:'????????????',
    }
  },
  {
    path: '/singleChainAnalysis/Btc/btcSingleCluster',
    name:'btcSingleCluster',
    component: btcSingleCluster,
    meta:{
      title:'????????????',
    }
  },
  {
    path: '/dataManagement',
    name: 'data_management',
    component: data_management,
    meta:{
      title:'???????????????',
    }
  },
  {
    path: '/userCenter',
    name: 'userCenter',
    component: userCenter,
    meta:{
        title:'????????????',
      },
    children :[{
      path: 'userFinishedTask',
      name: 'userFinishedTask',
      component: userFinishedTask,
      
    },
      {
        path: 'userUnfinishedTask',
        name: 'userUnfinishedTask',
        component: userUnfinishedTask,
      }
    ]
  },
  {
    path: '/singleChainAnalysis/Eth',
    name: 'Eth',
    component: Eth,
    meta:{
      title:'????????????',
    }
  },
  {
    path: '/singleChainAnalysis/Eth/ethBlockQuery',
    name: 'ethBlockQuery',
    component: ethBlockQuery,
    meta:{
      title:'????????????',
    }
  },
  {
    path: '/singleChainAnalysis/Eth/ethAddressQuery',
    name: 'ethAddressQuery',
    component: ethAddressQuery,
    meta:{
      title:'????????????',
    }
  },
  {
    path: '/singleChainAnalysis/Eth/ethTransactionQuery',
    name: 'ethTransactionQuery',
    component: ethTransactionQuery,
    meta:{
      title:'????????????',
    }
  },
  {
    path: '/singleChainAnalysis/Eth/ethInternalTransactionQuery',
    name: 'ethInternalTransactionQuery',
    component: ethInternalTransactionQuery,
    meta:{
      title:'????????????',
    }
  },
  {
    path: '/singleChainAnalysis/Eth/ethtxvalueQuery',
    name: 'ethtxvalueQuery',
    component: ethtxvalueQuery,
    meta:{
      title:'????????????',
    }
  },
  {
    path: '/singleChainAnalysis/Eth/ethSingleCluster',
    name:'ethSingleCluster',
    component: ethSingleCluster,
    meta:{
      title:'????????????',
    }
  },
  {
    path: '/singleChainAnalysis/Btc/communityAnalysis',
    name:'communityAnalysis',
    component: communityAnalysis,
    meta:{
      title:'????????????',
    }
  },
  {
    path: '/singleChainAnalysis/Btc/illegalActivityAnalysis',
    name:'illegalActivityAnalysis',
    component: illegalActivityAnalysis,
    meta:{
      title:'????????????',
    }
  },
  {
    path: '/singleChainAnalysis/Btc/TrackingModel',
    name:'TrackingModel',
    component: TrackingModel,
    meta:{
      title:'????????????',
    }
  },
  {
    path: '/login',
    name: 'Login',
    component: login,
    meta:{
      title:'??????',
    }
  },
  {
    path: '/registered',
    name: 'Regisert',
    component: register,
    meta:{
      title:'??????',
    }
  },
  {
    path: '/changepwd',
    name: 'changepwd',
    component: changepwd,
    meta:{
      title:'????????????',
    }
  },
  {
    path: '/singleChainAnalysis/Eos/EosBlockChart',
    name:'EosBlockChart',
    component: EosBlockChart,
    meta:{
      title:'????????????',
    }
  },
  {
    path: '/singleChainAnalysis/Eth/EthBlockChart',
    name:'EthBlockChart',
    component: EthBlockChart,
    meta:{
      title:'????????????',
    }
  },
  {
    path: '/singleChainAnalysis/Eos/EosTransactionChart',
    name:'EosTransactionChart',
    component: EosTransactionChart,
    meta:{
      title:'????????????',
    }
  },
  {
    path: '/singleChainAnalysis/Eos/EosSourceChart',
    name:'EosSourceChart',
    component: EosSourceChart,
    meta:{
      title:'????????????',
    }
  },
  {
    path:'/singleChainAnalysis/Eos/EosPriceChart',
    name:'EosPriceChart',
    component:EosPriceChart,
    meta:{
      title:'????????????',
    }
  },
  {
    path:'/singleChainAnalysis/Eth/ethGas',
    name:'ethGas',
    component:ethGas,
    meta:{
      title:'????????????',
    }
  },
  ??{
     path:'/singleChainAnalysis/Eth/ethPrice',
    ??name:'ethPrice',
    ??component:ethPrice,
      meta:{
        title:'????????????',
      }
    },
    {
    ????path:'/singleChainAnalysis/Eth/ethTransaction',
    ????name:'ethTransaction',
    ????component:ethTransaction,
      meta:{
        title:'????????????',
      }
    },


  ]
})
