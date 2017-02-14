<template>
  <div class="wrap">
    <mt-header fixed title="审核记录">
      <div slot="left">
        <mt-button icon="back" @click.native='$router.go(-1)'>
      </div>
    </mt-header>
    <div class="depicts">
      <ul>
        <li v-for="depict in flowDepict">
          <b></b>
          <p class="brief">
            <span class="nodeID">{{depict.nodeID}}</span>
            <span class="endTime">{{depict.endTime}}</span>
          </p>
          <p class="detail">
            <span class="checkPerson">{{depict.checkPerson}}</span>
            <span class="approval">
              {{depict.approvalOpinions}}<br>
              <!-- {{depict.approvalOpinions?depict.approvalOpinions:'无审核意见'}}<br> -->
              {{depict.nodeType === '转交' ? `${depict.nodeType} -> ${depict.workFlowNode}(${depict.checkPersons})`: `${depict.nodeType}`}}
            </span>
          </p>
          <b class="lastC" v-if="depict.workFlowNode === '结束'"></b>
          <b class="lastB" v-else></b>
        </li>
      </ul> 
    </div>
  </div>
</template>
<script>
import { Header, Button } from 'mint-ui'
import 'mint-ui/lib/header/style.css'
import 'mint-ui/lib/button/style.css'
export default {
  name: 'approveFlowdepict',
  components: {
    'mt-button': Button,
    'mt-header': Header
  },
  data () {
    return {}
  },
  computed: {
    flowDepict () {
      return this.$store.state.curFlowDepict
    }
  }
}
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
    $p-text-color-light:#26A2FF;  
    $p-text-color-weak: #555;
    .wrap {
      height: 100%;
      width: 100%;
      .depicts {
        margin-top: 56px;
        ul {
          margin-left:15px;
          li {
            width:100%;
            line-height:20px;
            font-weight:normal;
            list-style-type:none;
            border-left:2px solid $p-text-color-weak;
            padding-bottom: 25px;
            position: relative;
            b {
              width:8px;
              height:8px;
              background:#fff;
              border:2px solid #555;
              margin:5px;
              border-radius:6px;
              -webkit-border-radius:6px;
              -moz-border-radius:6px;
              overflow:hidden;
              display:inline-block;
              position: absolute;
              left: -12px;
            }
            b.lastB, b.lastC{
              display:none;
            }
            p.brief {
              padding-left:15px;
              font-size: smaller;
              position: relative;
              overflow: hidden;
              .nodeID, .endTime{
                float: left;
                display: inline-block;
              }
              .nodeID {
                width: 40%;
                font-weight: bolder;
              }
              .endTime {
                text-align: left;
                width: 57%;
              }
            }
            p.detail {
              padding-left:15px;
              position: relative;
              overflow: hidden;
              font-size: smaller;
              .checkPerson, .approval{
                float: left;
                display: inline-block;
              }
              .approval {
                text-align: left;
                width: 57%;
              }
              .checkPerson {
               font-weight: bolder; 
               width: 40%;
              }
            }
            .brief,.detail {
              color: $p-text-color-weak;
            }
          }
          li:nth-last-child(1) {
            padding-bottom:0;
            border-color: $p-text-color-light;
            b {
              border-color: $p-text-color-light;
            }
            .brief,.detail {
              color: $p-text-color-light;
            }
            b.lastB{
              display:inline-block;
              bottom: -12px;
              width:0;
              height:0;
              border-radius:0;
              border-top: 8px solid $p-text-color-light;
              border-right: 8px solid transparent;
              border-bottom: 8px solid transparent;
              border-left: 8px solid transparent;
              left: -14px;
            }
            b.lastC{
              display:inline-block;
              bottom: -6px;
              background:$p-text-color-light;
            }
          }
        }
      }
      .mint-header .mint-header-title {
        font-size: 18px;
      }
    }
</style>