webpackJsonp([51],{1312:function(t,e,a){"use strict";function n(t){return t&&t.__esModule?t:{default:t}}Object.defineProperty(e,"__esModule",{value:!0}),e.virtualException=e.rejectVirtual=e.editVirtual=e.addVirtual=e.regressVirtual=e.offlineVirtual=e.allotVirtual=e.fetchPhysical=e.virtualDetail=e.fetchVirtualList=e.save=e.fetchTemplateList=e.physicalException=e.physicalInitial=e.physicalRegress=e.physicalOffline=e.physicalRepair=e.physicalEdit=e.allotPhysicalService=e.allotPhysical=e.physicaldetail=e.add=e.update=e.upload=e.downLoad=e.fetchDictionary=e.fetchCommonFormList=void 0;var r=a(211),u=n(r),o=a(8),d=n(o),c=a(368),i=n(c),l=(e.fetchCommonFormList=function(){var t=(0,i.default)(u.default.mark(function t(e){return u.default.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return t.abrupt("return",(0,f.default)("/cmdb/list",{method:"POST",body:(0,d.default)({},e)}));case 1:case"end":return t.stop()}},t,this)}));return function(e){return t.apply(this,arguments)}}(),e.fetchDictionary=function(){var t=(0,i.default)(u.default.mark(function t(e){return u.default.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return t.abrupt("return",(0,f.default)("/cmdb/basicdic",{method:"GET"}));case 1:case"end":return t.stop()}},t,this)}));return function(e){return t.apply(this,arguments)}}(),e.downLoad=function(){var t=(0,i.default)(u.default.mark(function t(e){return u.default.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return t.abrupt("return",(0,f.default)("/cmdb/datadownload?file_type=0",{method:"GET"}));case 1:case"end":return t.stop()}},t,this)}));return function(e){return t.apply(this,arguments)}}(),e.upload=function(){var t=(0,i.default)(u.default.mark(function t(e){return u.default.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return t.abrupt("return",(0,f.default)("/servers/upload",{method:"POST",body:(0,d.default)({},e)}));case 1:case"end":return t.stop()}},t,this)}));return function(e){return t.apply(this,arguments)}}(),e.update=function(){var t=(0,i.default)(u.default.mark(function t(e){return u.default.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return t.abrupt("return",(0,f.default)("/cmdb/update",{method:"POST",body:(0,d.default)({},e)}));case 1:case"end":return t.stop()}},t,this)}));return function(e){return t.apply(this,arguments)}}(),e.add=function(){var t=(0,i.default)(u.default.mark(function t(e){return u.default.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return t.abrupt("return",(0,f.default)("/cmdb/add",{method:"POST",body:(0,d.default)({},e)}));case 1:case"end":return t.stop()}},t,this)}));return function(e){return t.apply(this,arguments)}}(),e.physicaldetail=function(){var t=(0,i.default)(u.default.mark(function t(e){return u.default.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return t.abrupt("return",(0,f.default)("/cmdb/detail",{method:"POST",body:(0,d.default)({},e)}));case 1:case"end":return t.stop()}},t,this)}));return function(e){return t.apply(this,arguments)}}(),e.allotPhysical=function(){var t=(0,i.default)(u.default.mark(function t(e){return u.default.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return t.abrupt("return",(0,f.default)("/cmdb/assiginresourcepool",{method:"POST",body:(0,d.default)({},e)}));case 1:case"end":return t.stop()}},t,this)}));return function(e){return t.apply(this,arguments)}}(),e.allotPhysicalService=function(){var t=(0,i.default)(u.default.mark(function t(e){return u.default.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return t.abrupt("return",(0,f.default)("/cmdb/assiginserver",{method:"POST",body:(0,d.default)({},e)}));case 1:case"end":return t.stop()}},t,this)}));return function(e){return t.apply(this,arguments)}}(),e.physicalEdit=function(){var t=(0,i.default)(u.default.mark(function t(e){return u.default.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return t.abrupt("return",(0,f.default)("/cmdb/edit",{method:"POST",body:(0,d.default)({},e)}));case 1:case"end":return t.stop()}},t,this)}));return function(e){return t.apply(this,arguments)}}(),e.physicalRepair=function(){var t=(0,i.default)(u.default.mark(function t(e){return u.default.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return t.abrupt("return",(0,f.default)("/cmdb/rejectrepair",{method:"POST",body:(0,d.default)({},e)}));case 1:case"end":return t.stop()}},t,this)}));return function(e){return t.apply(this,arguments)}}(),e.physicalOffline=function(){var t=(0,i.default)(u.default.mark(function t(e){return u.default.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return t.abrupt("return",(0,f.default)("/cmdb/offline",{method:"POST",body:(0,d.default)({},e)}));case 1:case"end":return t.stop()}},t,this)}));return function(e){return t.apply(this,arguments)}}(),e.physicalRegress=function(){var t=(0,i.default)(u.default.mark(function t(e){return u.default.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return t.abrupt("return",(0,f.default)("/cmdb/regress",{method:"POST",body:(0,d.default)({},e)}));case 1:case"end":return t.stop()}},t,this)}));return function(e){return t.apply(this,arguments)}}(),e.physicalInitial=function(){var t=(0,i.default)(u.default.mark(function t(e){return u.default.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return t.abrupt("return",(0,f.default)("/cmdb/init",{method:"POST",body:(0,d.default)({},e)}));case 1:case"end":return t.stop()}},t,this)}));return function(e){return t.apply(this,arguments)}}(),e.physicalException=function(){var t=(0,i.default)(u.default.mark(function t(e){return u.default.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return t.abrupt("return",(0,f.default)("/cmdb/exception",{method:"POST",body:(0,d.default)({},e)}));case 1:case"end":return t.stop()}},t,this)}));return function(e){return t.apply(this,arguments)}}(),e.fetchTemplateList=function(){var t=(0,i.default)(u.default.mark(function t(e){return u.default.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return t.abrupt("return",(0,f.default)("/account/user/dictionarys",{method:"POST",body:(0,d.default)({},e)}));case 1:case"end":return t.stop()}},t,this)}));return function(e){return t.apply(this,arguments)}}(),e.save=function(){var t=(0,i.default)(u.default.mark(function t(e){return u.default.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return t.abrupt("return",(0,f.default)("/account/user/data_dictionary",{method:"POST",body:(0,d.default)({},e)}));case 1:case"end":return t.stop()}},t,this)}));return function(e){return t.apply(this,arguments)}}(),e.fetchVirtualList=function(){var t=(0,i.default)(u.default.mark(function t(e){return u.default.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return t.abrupt("return",(0,f.default)("/cmdb/invent/list",{method:"POST",body:(0,d.default)({},e)}));case 1:case"end":return t.stop()}},t,this)}));return function(e){return t.apply(this,arguments)}}(),e.virtualDetail=function(){var t=(0,i.default)(u.default.mark(function t(e){return u.default.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return t.abrupt("return",(0,f.default)("/cmdb/invent/detail",{method:"POST",body:(0,d.default)({},e)}));case 1:case"end":return t.stop()}},t,this)}));return function(e){return t.apply(this,arguments)}}(),e.fetchPhysical=function(){var t=(0,i.default)(u.default.mark(function t(e){return u.default.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return t.abrupt("return",(0,f.default)("/cmdb/invent/physicals",{method:"POST",body:(0,d.default)({},e)}));case 1:case"end":return t.stop()}},t,this)}));return function(e){return t.apply(this,arguments)}}(),e.allotVirtual=function(){var t=(0,i.default)(u.default.mark(function t(e){return u.default.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return t.abrupt("return",(0,f.default)("/cmdb/invent/assiginserver",{method:"POST",body:(0,d.default)({},e)}));case 1:case"end":return t.stop()}},t,this)}));return function(e){return t.apply(this,arguments)}}(),e.offlineVirtual=function(){var t=(0,i.default)(u.default.mark(function t(e){return u.default.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return t.abrupt("return",(0,f.default)("/cmdb/invent/offline",{method:"POST",body:(0,d.default)({},e)}));case 1:case"end":return t.stop()}},t,this)}));return function(e){return t.apply(this,arguments)}}(),e.regressVirtual=function(){var t=(0,i.default)(u.default.mark(function t(e){return u.default.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return t.abrupt("return",(0,f.default)("/cmdb/invent/regress",{method:"POST",body:(0,d.default)({},e)}));case 1:case"end":return t.stop()}},t,this)}));return function(e){return t.apply(this,arguments)}}(),e.addVirtual=function(){var t=(0,i.default)(u.default.mark(function t(e){return u.default.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return t.abrupt("return",(0,f.default)("/cmdb/invent/add",{method:"POST",body:(0,d.default)({},e)}));case 1:case"end":return t.stop()}},t,this)}));return function(e){return t.apply(this,arguments)}}(),e.editVirtual=function(){var t=(0,i.default)(u.default.mark(function t(e){return u.default.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return t.abrupt("return",(0,f.default)("/cmdb/invent/edit",{method:"POST",body:(0,d.default)({},e)}));case 1:case"end":return t.stop()}},t,this)}));return function(e){return t.apply(this,arguments)}}(),e.rejectVirtual=function(){var t=(0,i.default)(u.default.mark(function t(e){return u.default.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return t.abrupt("return",(0,f.default)("/cmdb/invent/reject",{method:"POST",body:(0,d.default)({},e)}));case 1:case"end":return t.stop()}},t,this)}));return function(e){return t.apply(this,arguments)}}(),e.virtualException=function(){var t=(0,i.default)(u.default.mark(function t(e){return u.default.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return t.abrupt("return",(0,f.default)("/cmdb/invent/exception",{method:"POST",body:(0,d.default)({},e)}));case 1:case"end":return t.stop()}},t,this)}));return function(e){return t.apply(this,arguments)}}(),a(375)),f=n(l)},862:function(t,e,a){"use strict";function n(t){return t&&t.__esModule?t:{default:t}}Object.defineProperty(e,"__esModule",{value:!0});var r=a(369),u=n(r),o=a(354),d=n(o),c=a(221),i=n(c),l=a(211),f=n(l),s=a(8),p=n(s);a(370);var h=a(1312),m=a(344),v=function(t){return t.value};e.default={namespace:"TemplateList",state:{listInfo:{list:[],pagination:{current:1,pageSize:20,total:0},isLoading:!1},searchFormFields:{search_key:{value:void 0}},modalDataInfo:{modalStatus:!1,editId:"",modalData:{dic_name:{value:void 0},dic_content:{value:[]}}},operateAuthor:{}},effects:{fetchListData:f.default.mark(function t(e,a){var n,r,u,o=e.payload,d=a.call,c=a.put,i=a.select;return f.default.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,i(function(t){return t.TemplateList});case 2:return n=t.sent,r=(0,m.objKeyWrapper)(n.searchFormFields,v),t.next=6,c({type:"changeLoading",payload:!0});case 6:return t.next=8,d(h.fetchTemplateList,(0,p.default)({},r,o));case 8:if(u=t.sent,200!==u.code){t.next=12;break}return t.next=12,c({type:"saveList",payload:u.data});case 12:return t.next=14,c({type:"changeLoading",payload:!1});case 14:case"end":return t.stop()}},t,this)}),saveDicContentObj:f.default.mark(function t(e,a){var n,r=e.payload,u=e.dicName,o=a.put,d=(a.call,a.select);return f.default.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,d(function(t){return t.TemplateList.modalDataInfo.modalData});case 2:return n=t.sent,n={},n.dic_name={value:u},n.dic_content={value:r},r.forEach(function(t,e){n["dic_content"+e]={value:t}}),t.next=9,o({type:"changeDicContentObj",payload:n});case 9:case"end":return t.stop()}},t,this)}),addDeleteContent:f.default.mark(function t(e,a){var n,r,u,o,d=e.payload,c=a.put,l=(a.call,a.select);return f.default.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,l(function(t){return t.TemplateList.modalDataInfo.modalData});case 2:return n=t.sent,r=JSON.parse((0,i.default)(n)),u=r.dic_name,o=r.dic_content.value,"add"==d.type?o.push(void 0):o.splice(d.index,1),o.forEach(function(t,e){r["dic_content"+e]={value:t}}),t.next=10,c({type:"saveFormField",payload:r});case 10:case"end":return t.stop()}},t,this)}),handleCancel:f.default.mark(function t(e,a){var n,r,u=(e.payload,a.put),o=(a.call,a.select);return f.default.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,o(function(t){return t.TemplateList.modalDataInfo.modalData});case 2:return n=t.sent,r=n.dic_content.value,r.forEach(function(t,e){void 0==t&&delete n["dic_content"+e]}),n.dic_content.value=r.filter(function(t){return void 0!==t}),t.next=8,u({type:"resetFormField",payload:n});case 8:case"end":return t.stop()}},t,this)}),formFieldChange:f.default.mark(function t(e,a){var n,r,u,o=e.payload,c=(a.call,a.put),i=a.select;return f.default.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return n=(0,d.default)(o)[0].substr(-1,1),t.next=3,i(function(t){return t.TemplateList.modalDataInfo.modalData});case 3:return r=t.sent,u=r.dic_content.value,u.splice(n,1,o["dic_content"+n].value),r["dic_content"+n]=o["dic_content"+n],t.next=9,c({type:"saveFormField",payload:r});case 9:case"end":return t.stop()}},t,this)}),save:f.default.mark(function t(e,a){var n,r,o,d=e.payload,c=a.put,i=a.call,l=a.select;return f.default.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,i(h.save,(0,p.default)({},d));case 2:if(n=t.sent,200!=n.code){t.next=11;break}return u.default.success(n.msg),t.next=7,l(function(t){return t.TemplateList});case 7:return r=t.sent,o=(0,m.objKeyWrapper)(r.searchFormFields,v),t.next=11,c({type:"fetchListData",payload:(0,p.default)({},o,{page:r.listInfo.pagination.current,page_size:r.listInfo.pagination.pageSize})});case 11:return t.next=13,c({type:"changeModalStatus",payload:{bol:!1,id:void 0}});case 13:case"end":return t.stop()}},t,this)})},reducers:{searchFormFieldChange:function(t,e){var a=e.payload;return(0,p.default)({},t,{searchFormFields:(0,p.default)({},t.searchFormFields,a)})},saveList:function(t,e){return(0,p.default)({},t,{listInfo:(0,p.default)({},t.listInfo,{list:e.payload.msgdata},{pagination:{current:e.payload.current_page,total:e.payload.total,pageSize:e.payload.page_size}}),operateAuthor:e.payload.permissions})},changeLoading:function(t,e){return(0,p.default)({},t,{listInfo:(0,p.default)({},t.listInfo,{isLoading:e.payload})})},changeModalStatus:function(t,e){return(0,p.default)({},t,{modalDataInfo:(0,p.default)({},t.modalDataInfo,{modalStatus:e.payload.bol},{editId:e.payload.id})})},changeDicContentObj:function(t,e){return(0,p.default)({},t,{modalDataInfo:(0,p.default)({modalStatus:t.modalDataInfo.modalStatus},{editId:t.modalDataInfo.editId},{modalData:(0,p.default)({},e.payload)})})},saveFormField:function(t,e){return(0,p.default)({},t,{modalDataInfo:(0,p.default)({modalStatus:t.modalDataInfo.modalStatus},{editId:t.modalDataInfo.editId},{modalData:(0,p.default)({},t.modalDataInfo.modalData,e.payload)})})},resetFormField:function(t,e){return(0,p.default)({},t,{modalDataInfo:(0,p.default)({},t.modalDataInfo,{modalData:e.payload})})}}},t.exports=e.default}});