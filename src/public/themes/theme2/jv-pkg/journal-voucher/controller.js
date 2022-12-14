 app.component('journalVoucherList', {
    templateUrl: journal_voucher_list_template_url,
    controller: function($http, $location, HelperService, $scope, $routeParams, $rootScope, $location, $mdSelect) {
        $scope.loading = true;
        $('#search_journal_voucher').focus();
        var self = this;
        self.hasPermission = HelperService.hasPermission;
        self.add_permission = self.hasPermission('add-journal-voucher');
        if (!self.hasPermission('journal-vouchers')) {
            window.location = "#!/page-permission-denied";
            return false;
        }
        $http.get(
            laravel_routes['getVerificationFilter'],
        ).then(function(response) {
            console.log(response.data);
            self.extras = response.data.extras;
            $rootScope.loading = false;
            //console.log(self.extras);
        });
        var table_scroll;
        var dataTable;
        setTimeout(function() {
            table_scroll = $('.page-main-content.list-page-content').height() - 37;
            dataTable = $('#journal_vouchers_list').DataTable({
                "dom": cndn_dom_structure,
                "language": {
                    "lengthMenu": "Rows _MENU_",
                    "paginate": {
                        "next": '<i class="icon ion-ios-arrow-forward"></i>',
                        "previous": '<i class="icon ion-ios-arrow-back"></i>'
                    },
                },
                pageLength: 10,
                processing: true,
                stateSaveCallback: function(settings, data) {
                    localStorage.setItem('CDataTables_' + settings.sInstance, JSON.stringify(data));
                },
                stateLoadCallback: function(settings) {
                    var state_save_val = JSON.parse(localStorage.getItem('CDataTables_' + settings.sInstance));
                    if (state_save_val) {
                        $('#search_journal_voucher').val(state_save_val.search.search);
                    }
                    return JSON.parse(localStorage.getItem('CDataTables_' + settings.sInstance));
                },
                serverSide: true,
                paging: true,
                stateSave: true,
                ordering: false,
                scrollY: table_scroll + "px",
                scrollCollapse: true,
                ajax: {
                    url: laravel_routes['getJournalVoucherList'],
                    type: "GET",
                    dataType: "json",
                    data: function(d) {
                        d.voucher_number = $('#voucher_number').val();
                        d.jv_date = $('#jv_date').val();
                        d.type_id = $('#type_id').val();
                        d.from_account_type_id = $('#from_account_type_id').val();
                        d.to_account_type_id = $('#to_account_type_id').val();
                        d.status_id = $('#status_id').val();
                    },
                },

                columns: [
                    { data: 'child_checkbox', searchable: false },
                    { data: 'action', class: 'action', name: 'action', searchable: false },
                    { data: 'voucher_number', name: 'journal_vouchers.voucher_number', searchable: true },
                    { data: 'jv_status', name: 'approval_type_statuses.status', searchable: false },
                    { data: 'jv_date', searchable: false },
                    { data: 'jv_type', name: 'journal_vouchers.type_id', searchable: false },
                    { data: 'from_account_type', name: 'from_account_types.name', searchable: false },
                    { data: 'from_ac_code', searchable: false },
                    { data: 'to_account_type', name: 'to_account_types.name', searchable: false },
                    { data: 'to_ac_code', searchable: false },
                    { data: 'amount', name: 'journal_vouchers.amount', searchable: false },
                ],
                "initComplete": function(settings, json) {
                    $('.dataTables_length select').select2();
                },
                "infoCallback": function(settings, start, end, max, total, pre) {
                    $('#table_info').html(total)
                    $('.foot_info').html('Showing ' + start + ' to ' + end + ' of ' + max + ' entries')
                },
                rowCallback: function(row, data) {
                    $(row).addClass('highlight-row');
                }
            });
        }, 1000);
        $('.modal').bind('click', function(event) {
            if ($('.md-select-menu-container').hasClass('md-active')) {
                $mdSelect.hide();
            }
        });
        $('.refresh').on('click', function() {
            $('#journal_vouchers_list').DataTable().ajax.reload();
        });
        $("#search_journal_voucher").on('keyup', function() {
            dataTable
                .search(this.value)
                .draw();
        });
        $scope.clear_search = function() {
            $('#search_journal_voucher').val('');
            $('#journal_vouchers_list').DataTable().search('').draw();
        }

        $('body').on('click', '.applyBtn', function() { //alert('sd');
            setTimeout(function() {
                dataTable.draw();
            }, 900);
        });
        $('body').on('click', '.cancelBtn', function() { //alert('sd');
            setTimeout(function() {
                dataTable.draw();
            }, 900);
        });

        $('.align-left.daterange').daterangepicker({
            autoUpdateInput: false,
            "opens": "left",
            locale: {
                cancelLabel: 'Clear',
                format: "DD-MM-YYYY"
            }
        });

        $('.daterange').on('apply.daterangepicker', function(ev, picker) {
            $(this).val(picker.startDate.format('DD-MM-YYYY') + ' to ' + picker.endDate.format('DD-MM-YYYY'));
        });

        $('.daterange').on('cancel.daterangepicker', function(ev, picker) {
            $(this).val('');
        });
        //FOR FILTER
        $('#voucher_number').keyup(function() {
            setTimeout(function() {
                dataTable.draw();
            }, 900);
        });

        $scope.onSelectedType = function(selected_type) {
            setTimeout(function() {
                $('#type_id').val(selected_type);
                dataTable.draw();
            }, 900);
        }
        $scope.onSelectedFromAccType = function(selected_from_acc_type) {
            setTimeout(function() {
                $('#from_account_type_id').val(selected_from_acc_type);
                dataTable.draw();
            }, 900);
        }
        $scope.onSelectedToAccType = function(selected_to_acc_type) {
            setTimeout(function() {
                $('#to_account_type_id').val(selected_to_acc_type);
                dataTable.draw();
            }, 900);
        }
        $scope.getSelectedStatus = function(selected_status_id) {
            setTimeout(function() {
                $('#status_id').val(selected_status_id);
                dataTable.draw();
            }, 900);
        }
        $scope.reset_filter = function() {
            $('#voucher_number').val('');
            $('#jv_date').val('');
            $('#type_id').val('');
            $('#from_account_type_id').val('');
            $('#to_account_type_id').val('');
            $('#status_id').val('');
            dataTable.draw();
        }

        //DELETE
        $scope.deleteJournalVoucher = function($id) {
            $('#journal_voucher_id').val($id);
        }
        $scope.deleteConfirm = function() {
            $id = $('#journal_voucher_id').val();
            // alert($id);
            $http.get(
                laravel_routes['deleteJournalVoucher'], {
                    params: {
                        id: $id,
                    }
                }
            ).then(function(response) {
                if (response.data.success) {
                    $noty = new Noty({
                        type: 'success',
                        layout: 'topRight',
                        text: 'Journal Voucher Deleted Successfully',
                    }).show();
                    setTimeout(function() {
                        $noty.close();
                    }, 3000);
                    $('#journal_vouchers_list').DataTable().ajax.reload(function(json) {});
                    $location.path('/jv-pkg/journal-voucher/list');
                }
            });
        }

        $('#send_for_approval').on('click', function() { //alert('dsf');
            if ($('.journal_voucher_checkbox:checked').length > 0) {
                var send_for_approval = []
                $('input[name="child_boxes"]:checked').each(function() {
                    send_for_approval.push(this.value);
                });
                console.log(send_for_approval);
                // return false;
                $http.post(
                    laravel_routes['journalVoucherMultipleApproval'], {
                        send_for_approval: send_for_approval,
                        // approval_level_id: $routeParams.level_id,
                    }
                ).then(function(response) {
                    if (response.data.success == true) {
                        custom_noty('success', response.data.message);
                        $('#journal_vouchers_list').DataTable().ajax.reload();
                        $scope.$apply();
                        // $timeout(function() {
                        //     RefreshTable();
                        // }, 1000);
                    } else {
                        custom_noty('error', response.data.errors);
                    }
                });
            } else {
                custom_noty('error', 'Please Select Checkbox');
            }
        })
        // $('.refresh_table').on("click", function() {
        //     RefreshTable();
        // });
        $('#parent').on('click', function() {
            if (this.checked) {
                $('.journal_voucher_checkbox').each(function() {
                    this.checked = true;
                });
            } else {
                $('.journal_voucher_checkbox').each(function() {
                    this.checked = false;
                });
            }
        });
        $(document.body).on('click', '.journal_voucher_checkbox', function() {
            if ($('.journal_voucher_checkbox:checked').length == $('.journal_voucher_checkbox').length) {
                $('#parent').prop('checked', true);
            } else {
                $('#parent').prop('checked', false);
            }
        });

        $rootScope.loading = false;
    }
});
//------------------------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------------------
app.component('journalVoucherForm', {
    templateUrl: journal_voucher_form_template_url,
    controller: function($http, $location, HelperService, $scope, $routeParams, $rootScope, $q) {
        var self = this;
        self.hasPermission = HelperService.hasPermission;
        if (!self.hasPermission('add-journal-voucher') || !self.hasPermission('edit-journal-voucher')) {
            window.location = "#!/page-permission-denied";
            return false;
        }
        self.angular_routes = angular_routes;
        var attachment_removal_ids = [];
        $("input:text:visible:first").focus();
        $http({
            url: laravel_routes['getJournalVoucherFormData'],
            method: "GET",
            params: {
                'id': typeof($routeParams.id) == 'undefined' ? null : $routeParams.id,
            }
        }).then(function(response) {
            self.jv = response.data.journal_voucher;
            self.jv.invoices = response.data.invoices;
            self.from_account = self.jv.from_account;
            self.to_account = self.jv.to_account;
            self.jv_type_list = response.data.jv_type_list;
            self.journal_list = response.data.journal_list;
            self.account_type_list = response.data.account_type_list;
            // self.action = response.data.action;
            $rootScope.loading = false;
            if(self.jv.action == 'Edit'){
            //ATTACHMENTS
                if (self.jv.attachments.length) {
                    $(self.jv.attachments).each(function(key, attachment) {
                        var design = '<div class="imageuploadify-container" data-attachment_id="' + attachment.id + '" style="margin-left: 0px; margin-right: 0px;">' +
                            '<div class="imageuploadify-btn-remove"><button type="button" class="btn btn-danger glyphicon glyphicon-remove"></button> ' +
                            ' <div class="imageuploadify-details"><div class="imageuploadify-file-icon"></div><span class="imageuploadify-file-name"><a href="' + jv_attachements_url + '/' + attachment.name + '">' + attachment.name + '' +
                            '</span><span class="imageuploadify-file-type">image/jpeg</span>' +
                            '</a><span class="imageuploadify-file-size">369960</span></div>' +
                            '</div></div>';
                        $('.imageuploadify-images-list').append(design);
                    });
                }
            }
        });

        //SELECT JV TYPE GET JOURNAL && FROM ACC && TO ACC 
        $scope.jvTypeChanged = function($id) {
            $http.get(
                laravel_routes['getJVType'], {
                    params: {
                        id: $id,
                    }
                }
            ).then(function(response) {
                self.type = response.data.jv_type;
                if (!self.type.journal_editable) {
                    self.jv.journal = self.type.journal;
                    self.jv.type.journal_editable = self.type.journal_editable;
                }
                if (!self.type.from_account_type_editable) {
                    self.jv.from_account_type = self.type.from_account_type;
                    self.jv.type.from_account_type_editable = self.type.from_account_type_editable;
                }
                if (!self.type.to_account_type_editable) {
                    self.jv.to_account_type = self.type.to_account_type;
                    self.jv.type.to_account_type_editable = self.type.to_account_type_editable;
                }
            });
        }

        self.searchCustomer = $rootScope.searchCustomer;

        //GET CUSTOMER DETAILS
        $scope.customerSelected = function(type) {
            if (type == 'fromAcc') {
                var res = $rootScope.getCustomer(self.from_account.id).then(function(res) {
                    console.log(res.data);
                    if (!res.data.success) {
                        custom_noty('error', res.data.error);
                        return;
                    }
                    self.jv.from_account = res.data.customer
                });
            } else {
                var res = $rootScope.getCustomer(self.to_account.id).then(function(res) {
                    if (!res.data.success) {
                        custom_noty('error', res.data.error);
                        return;
                    }
                    self.jv.to_account = res.data.customer
                });
            }
        }

        self.getReceipt = function($for) {
            if ($for == 'from') {
                if (!self.from_receipt_no) {
                    custom_noty('error', 'Please enter receipt number');
                    $('#from_receipt_no').focus();
                    return;
                }
                if (!self.jv.from_account) {
                    custom_noty('error', 'Please select from account code');
                    return;
                }
                var account_code = self.jv.from_account.code;
                var receipt_number = self.from_receipt_no;
            } else {
                if (!self.to_receipt_no) {
                    custom_noty('error', 'Please enter receipt number');
                    $('#to_receipt_no').focus();
                    return;
                }
                if (!self.jv.to_account) {
                    custom_noty('error', 'Please select to account code');
                    return;
                }
                var account_code = self.jv.to_account.code;
                var receipt_number = self.to_receipt_no;
            }

            $http.get(
                laravel_routes['getReceipts'], {
                    params: {
                        account_code: account_code,
                        receipt_number: receipt_number,
                        limit: 1,
                    }
                }
            ).then(function(response) {
                if (!response.data.success) {
                    custom_noty('error', response.data.error);
                    return;
                }
                self.jv.receipts.push(response.data.receipt);
                self.jv.total_receipt_amount = parseFloat(self.jv.total_receipt_amount) + parseFloat(response.data.receipt.balance_amount);
                self.from_receipt_no = '';
                self.to_receipt_no = '';
            });
        }

        //REMOVE SERVICE INVOICE ITEM
        $scope.removeReceipt = function(index) {
            self.jv.total_receipt_amount -= parseFloat(self.jv.receipts[index].balence_amount);
            self.jv.receipts.splice(index, 1);
        }

        $scope.getInvoices = function($for) {
            if ($for == 'from') {
                if (!self.jv.from_account) {
                    custom_noty('error', 'Please select from account code');
                    return;
                }
                var account_id = self.jv.from_account.id;
                var dataTable_id = '#from_invoices_table';
            } else {
                if (!self.jv.to_account) {
                    custom_noty('error', 'Please select to account code');
                    return;
                }
                var account_id = self.jv.to_account.id;
                var dataTable_id = '#to_invoices_table';
            }

            $http.get(
                laravel_routes['getInvoices'], {
                    params: {
                        account_id: account_id,
                    }
                }
            ).then(function(response) {
                console.log(response.data);
                if (!response.data.success) {
                    custom_noty('error', response.data.error);
                    return;
                }
                self.jv.invoices = response.data.invoices;
            });
        }


        //ATTACHMENT REMOVE
        $(document).on('click', ".main-wrap .imageuploadify-container .imageuploadify-btn-remove button", function() {
            var attachment_id = $(this).parent().parent().data('attachment_id');
            attachment_removal_ids.push(attachment_id);
            $('#attachment_removal_ids').val(JSON.stringify(attachment_removal_ids));
            $(this).parent().parent().remove();
        });

        /* Image Uploadify Funtion */
        $('.image_uploadify').imageuploadify();

        /* JV DatePicker*/
        $('.jvDatePicker').bootstrapDP({
            format: "dd-mm-yyyy",
            autoclose: "true",
            todayHighlight: true,
            // startDate: min_offset,
            // endDate: max_offset
        });

        $('#parent_checkbox').on('click', function() {
            if (this.checked) {
                self.check_List = true;
                $('.jv_Checkbox').each(function() {
                    this.checked = true;
                });
                self.added_Title = 'Invoices added';
                self.checked_Count = $('.jv_Checkbox:checked').length;
                if ($('.jv_Checkbox:checked').length > 0) {
                    var selected_List = []
                    // var checked_invoices;
                    $('input[name="child_boxes"]:checked').each(function() {
                        selected_List.push(this.value);
                    });
                    self.checked_List = selected_List.join(', ');
                    console.log(self.checked_List);
                }
            } else { //console.log('uncheckParent');
                self.check_List = false;
                self.added_Title = '';
                self.checked_Count = $('.jv_Checkbox:checked').length;
                self.checked_List = '';
                $('.jv_Checkbox').each(function() {
                    this.checked = false;
                });
            }
        });

        var form_id = '#form';
        var v = jQuery(form_id).validate({
            ignore: '',
            rules: {
                'type_id': {
                    required: true,
                },
                'date': {
                    required: true,
                },
                'from_account_id': {
                    required: true,
                },
                'to_account_id': {
                    required: true,
                },
                'reason': {
                    required: true,
                },
                'amount': {
                    required: true,
                    number: true,
                },
            },
            invalidHandler: function(event, validator) {
                $noty = new Noty({
                    type: 'error',
                    layout: 'topRight',
                    text: 'You have errors,Please check all tabs'
                }).show();

                console.log(validator.errorList);
            },
            submitHandler: function(form) {
                let formData = new FormData($(form_id)[0]);
                $('.submit').button('loading');
                $.ajax({
                        url: laravel_routes['saveJournalVoucher'],
                        method: "POST",
                        data: formData,
                        processData: false,
                        contentType: false,
                    })
                    .done(function(res) {
                        if (res.success == true) {
                            $noty = new Noty({
                                type: 'success',
                                layout: 'topRight',
                                text: res.message,
                            }).show();
                            setTimeout(function() {
                                $noty.close();
                            }, 3000);
                            $location.path('/jv-pkg/journal-voucher/list');
                            $scope.$apply();
                        } else {
                            if (!res.success == true) {
                                $('.submit').button('reset');
                                var errors = '';
                                for (var i in res.errors) {
                                    errors += '<li>' + res.errors[i] + '</li>';
                                }
                                $noty = new Noty({
                                    type: 'error',
                                    layout: 'topRight',
                                    text: errors
                                }).show();
                            } else {
                                $('.submit').button('reset');
                                $location.path('/jv-pkg/journal-voucher/list');
                                $scope.$apply();
                            }
                        }
                    })
                    .fail(function(xhr) {
                        $('.submit').button('reset');
                        $noty = new Noty({
                            type: 'error',
                            layout: 'topRight',
                            text: 'Something went wrong at server',
                        }).show();
                    });
            }
        });
    }
});
//------------------------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------------------
app.component('journalVoucherView', {
    templateUrl: journal_voucher_view_template_url,
    controller: function($http, $location, HelperService, $scope, $routeParams, $rootScope, $element, $mdSelect, $timeout) {
        var self = this;
        self.hasPermission = HelperService.hasPermission;
        if (self.hasPermission('view-journal-voucher')) {
            window.location = "#!/page-permission-denied";
            return false;
        }
        self.angular_routes = angular_routes;
        self.ref_attachements_url_link = ref_attachements_url;
        $http({
            url: laravel_routes['viewJournalVoucher'],
            method: "GET",
            params: {
                id: $routeParams.id,
            }
        }).then(function(response) {
            console.log(response.data);
            self.jv = response.data.journal_voucher;
            self.reject_reasons = response.data.reject_reasons;
            self.jv.activity_logs = response.data.activity_logs;
            self.status_id = response.data.status_id;
            // self.ref_attachements_url_link = jv_attachements_url;
            $rootScope.loading = false;
        });

        $scope.sendForApproval = function() {
            $rootScope.loading = true;
            $http({
                url: laravel_routes['updateJVStatus'],
                method: "POST",
                params: {
                    id: self.jv.id,
                    status_id: self.status_id,
                }
            }).then(function(response) {
                $('#approve-popup').modal('hide');
                // $rootScope.loading = false;
                if (!response.data.success) {
                    custom_noty('error', response.data.error);
                    return;
                }
                $timeout(function(){
                    custom_noty('success', response.data.message);
                    $location.path('/jv-pkg/journal-voucher/list');
                    $scope.$apply();
                },1000);
            });
        }
    }
});

app.component('jvFormHeader', {
    templateUrl: jv_form_header_template_url,
    bindings: {
        jv: '<',
    },
    controller: function($http, $location, HelperService, $scope, $routeParams, $rootScope) {
        var self = this;
    }
});

app.component('jvReceiptsTable', {
    templateUrl: jv_receipts_table_template_url,
    bindings: {
        jv: '<',
    },
    controller: function($http, $location, HelperService, $scope, $routeParams, $rootScope) {
        var self = this;
    }
});

app.component('jvInvoicesTable', {
    templateUrl: jv_invoices_table_template_url,
    bindings: {
        jv: '=',
    },
    controller: function($http, $location, HelperService, $scope, $routeParams, $rootScope) {
        var self = this;
        $scope.invoiceUpdated = function() {
            self.jv.invoices_length = 0;
            self.jv.total_invoice_amount = 0;
            angular.forEach(self.jv.invoices, function(invoice, key) {
                if (invoice.selected) {
                    self.jv.invoices_length++;
                    self.jv.total_invoice_amount += parseFloat(invoice.balance_amount);
                }
            });
        }

    }
});

app.component('jvAmountDetailsView', {
    templateUrl: jv_amount_details_view_template_url,
    bindings: {
        jv: '<',
    },
    controller: function($http, $location, HelperService, $scope, $routeParams, $rootScope) {
        var self = this;
    }
});

app.component('jvActivityLogs', {
    templateUrl: jv_activity_logs_template_url,
    bindings: {
        jv: '<',
    },
    controller: function($http, $location, HelperService, $scope, $routeParams, $rootScope) {
        var self = this;
    }
});