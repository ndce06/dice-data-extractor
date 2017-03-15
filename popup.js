document.addEventListener('DOMContentLoaded', function() {
    
    var MATCH_LIST = [
        {match: 'FSCM', point: 100},
        {match: 'AR', point: 100},
        {match: 'RECEIVABLE', point: 100},
        {match: 'CREDIT', point: 100},
        {match: 'COLLECTION', point: 100},
        {match: 'DISPUTE', point: 100},
        {match: 'HIGH RADIUS', point: 100},
        {match: 'ACCOUNT', point: 70},
        {match: 'ACCOUNTS', point: 70},
        {match: 'EBS', point: 50},
        {match: 'HANSE ORGA', point: 50},
        {match: 'BANK', point: 50},
        {match: 'PAYABLE', point: 40},
        {match: 'FINANCE', point: 40},
        {match: 'FICO', point: 40},
        {match: 'FI', point: 40}
    ];

    var PRIORITY = {
        PRIORITY_VERY_HIGH: 70,
        PRIORITY_HIGH: 50,
        PRIORITY_MEDIUM: 30,
        PRIORITY_LOW: 0
    }

    var info = function() {
        jQuery('#info').hide();
        jQuery('#aDownload').hide();
        jQuery('#aClear').hide();
        jQuery('ul.infoList').find('li').remove();

        var captureData = JSON.parse(localStorage.getItem("captureData"));
        if(captureData) {
            jQuery.each( captureData, function( key, value ) {
                var li = jQuery("<li>Data captured for page "+ value.page +"</li>");
                jQuery('ul.infoList').append(li);
            });
            jQuery('#info').show();
            jQuery('#aDownload').show();
            jQuery('#aClear').show();
        };
    };

    jQuery('#btnAddMatch').on('click', function(){
        var txtMatch = jQuery('#txtAddMatch');
        var txtPoint = jQuery('#txtAddPoint');

        if(jQuery.trim(txtMatch.val()) === '') {
            alert('Please enter match');
            txtMatch.focus();
            return false;
        }
        if(jQuery.trim(txtPoint.val()) === '' || isNaN(jQuery.trim(txtPoint.val()))) {
            alert('Please enter numeric point value');
            txtPoint.focus();
            return false;
        }

        var matchList = JSON.parse(localStorage.getItem("matchList")) || MATCH_LIST;
        matchList.push({ match: jQuery.trim(txtMatch.val()), point: parseInt(txtPoint.val(), 10) });
        localStorage.setItem("matchList", JSON.stringify(matchList));

        loadMatchList();
        txtMatch.val('');
        txtPoint.val('');
    });

    jQuery('.txtPriority').on('change', function() {
        var txt = jQuery(this);
        if(jQuery.trim(txt.val()) === "" || isNaN(txt.val())) {
            return false;
        }
        PRIORITY[txt.attr('id')] = txt.val();
    });

    jQuery('.txtPriority').on('blur', function() {
        var txt = jQuery(this);
        if(jQuery.trim(txt.val()) === "" || isNaN(txt.val())) {
            txt.val(PRIORITY[txt.attr('id')]);    
        }
    });

    jQuery('#btnToggleMatchList').on('click', function() {
        if(jQuery(this).find('i.glyphicon').hasClass('glyphicon-plus')) {
            jQuery(this).find('i.glyphicon').removeClass('glyphicon-plus');
            jQuery(this).find('i.glyphicon').addClass('glyphicon-minus')
        } else {
            jQuery(this).find('i.glyphicon').removeClass('glyphicon-minus');
            jQuery(this).find('i.glyphicon').addClass('glyphicon-plus')
        }
        togglePanel('pnlMatchList');
    });

    jQuery('#btnTogglePriority').on('click', function() {
        if(jQuery(this).find('i.glyphicon').hasClass('glyphicon-plus')) {
            jQuery(this).find('i.glyphicon').removeClass('glyphicon-plus');
            jQuery(this).find('i.glyphicon').addClass('glyphicon-minus')
        } else {
            jQuery(this).find('i.glyphicon').removeClass('glyphicon-minus');
            jQuery(this).find('i.glyphicon').addClass('glyphicon-plus')
        }
        togglePanel('pnlPriority');
    });

    info();
    loadMatchList();
    loadPriority();

    function loadPriority() {
        jQuery.each(PRIORITY, function(key, value) {
            jQuery('#'+key).val(value);
        });
    }

    function loadMatchList() {
        var matchList = JSON.parse(localStorage.getItem("matchList")) || MATCH_LIST;

        jQuery('.btnEdit').off();
        jQuery('.btnDelete').off();
        jQuery('.btnUpdate').off();
        jQuery('.btnCancel').off();

        jQuery('#tblMatchList').find('tbody>tr').remove();
        jQuery.each(matchList, function(index, value) {
           var tdMatch = jQuery('<td><span class="spMatch">'+value.match+'</span></td>');
           tdMatch.append(jQuery('<input type="text" class="txtMatch" value="'+value.match+'" />').hide());
           var tdPoint = jQuery('<td><span class="spPoint">'+value.point+'</span></td>');
           tdPoint.append(jQuery('<input type="number" class="txtPoint" value="'+value.point+'" />').hide());
           var btnEdit = jQuery('<a class="btn btnEdit" title="Edit"><i class="glyphicon glyphicon-edit"></i></a>').on('click', editMatch(value));
           var btnDelete = jQuery('<a class="btn btnDelete" title="Delete"><i class="glyphicon glyphicon-trash"></i></a>').on('click', deleteMatch(value, index));
           var btnUpdate = jQuery('<a class="btn btnUpdate" title="Update"><i class="glyphicon glyphicon-ok"></i></a>').on('click', updateMatch(index)).hide();
           var btnCancel = jQuery('<a class="btn btnCancel" title="Cancel"><i class="glyphicon glyphicon-remove"></i></a>').on('click', function() { resetAllMatch(); }).hide();

           var tdBtn = jQuery('<td></td>').append(btnEdit).append(btnDelete).append(btnUpdate).append(btnCancel);

           var tr = jQuery('<tr></tr>').append(tdMatch).append(tdPoint).append(tdBtn);
           jQuery(jQuery('#tblMatchList').find('tbody')[0]).append(tr);

        });
    }

    function editMatch(value) {
        return function() {
            //All other row - reset 
            resetAllMatch();

            var btnEdit = jQuery(this).hide();
            var tr = btnEdit.parents('tr');
            jQuery(tr).find('.txtMatch').val(value.match).show();
            jQuery(tr).find('.txtPoint').val(value.point).show();
            jQuery(tr).find('.spMatch').hide();
            jQuery(tr).find('.spPoint').hide();
            jQuery(tr).find('.btnDelete').hide();
            jQuery(tr).find('.btnUpdate').show();
            jQuery(tr).find('.btnCancel').show();

        };
    }

    function deleteMatch(value, index) {
        return function() {
            if(confirm('Are you sure to delete match: ' + value.match + '?')) {
                var matchList = JSON.parse(localStorage.getItem("matchList")) || MATCH_LIST;
                matchList.splice(index, 1);
                localStorage.setItem("matchList", JSON.stringify(matchList));

                // Reload Match list
                loadMatchList();
            }
        };
    }

    function updateMatch(index) {
        return function() {
            var btnUpdate = jQuery(this);
            var tr = btnUpdate.parents('tr');
            var txtMatch = jQuery(tr).find('.txtMatch');
            var txtPoint = jQuery(tr).find('.txtPoint');

            if(jQuery.trim(txtMatch.val()) === '') {
                alert('Please enter match');
                txtMatch.focus();
                return false;
            }
            if(jQuery.trim(txtPoint.val()) === '' || isNaN(jQuery.trim(txtPoint.val()))) {
                alert('Please enter numeric point value');
                txtPoint.focus();
                return false;
            }

            var matchList = JSON.parse(localStorage.getItem("matchList")) || MATCH_LIST;
            matchList[index] = { match: jQuery.trim(txtMatch.val()), point: parseInt(txtPoint.val(), 10) };
            localStorage.setItem("matchList", JSON.stringify(matchList));

            // Reload Match list
            loadMatchList();
        }
    }

    function resetAllMatch() {
        jQuery('.spMatch').show();
        jQuery('.spPoint').show();
        jQuery('.txtMatch').hide();
        jQuery('.txtPoint').hide();
        jQuery('.btnEdit').show();
        jQuery('.btnDelete').show();
        jQuery('.btnUpdate').hide();
        jQuery('.btnCancel').hide();
    }

    function togglePanel(panelId) {
        jQuery('#'+panelId).toggle();
    }
    
    var aClear = document.getElementById('aClear');
    aClear.addEventListener('click', function() {
        localStorage.removeItem("captureData");
        jQuery('#aExcel').remove();
        info();
    });

    var aDownload = document.getElementById('aDownload');
    aDownload.addEventListener('click', function() {
        var captureData = JSON.parse(localStorage.getItem("captureData"));
        if(captureData) {
            var colDelim = '","',
                rowDelim = '"\r\n"', 
                csv = 'JOB TITLE","LOCATION","POSTED_TIME","COMPANY","DESCRIPTION","JOB_HTML_LINK","COMPANY_LINK","JOB_TYPE","MATCH","POINT","PRIORITY';

            jQuery.each( captureData, function( key, value ) {
                csv += value.csv;
            });

            // Data URI
            csv = '"' + csv + '"';
            var csvData = 'data:application/csv;charset=utf-8,' + encodeURIComponent(csv);

            //DOWNLOAD Link
            jQuery('<a id="aExcel"><span class="glyphicon glyphicon-download" aria-hidden="true"></span> Download Excel</a>').attr({
                'download': 'export.csv',
                    'href': csvData,
                    'target': '_blank'
            }).appendTo('#panelBody').on("click",function(){
                jQuery(this).remove();
            });
        }
    });

    var checkPageButton = document.getElementById('checkPage');
    checkPageButton.addEventListener('click', function() {    
        chrome.tabs.getSelected(null, function(tab) {
          // Send a request to the content script.
          chrome.tabs.sendRequest(tab.id, { action: "getDOM" }, function(response) {
            if(response && response.dom) {
              var searchContent = jQuery(response.dom).find('#serp');
              if(searchContent && searchContent.length > 0) {
                var $rows = jQuery(searchContent[0]).find('.serp-result-content');
                var tmpColDelim = String.fromCharCode(11), // vertical tab character
                    tmpRowDelim = String.fromCharCode(0), // null character

                    // actual delimiter characters for CSV format
                    colDelim = '","',
                    rowDelim = '"\r\n"', csv = '';
                    //csv = 'JOB TITLE","LOCATION","POSTED_TIME","COMPANY","DESCRIPTION","JOB_HTML_LINK","COMPANY_LINK","JOB_TYPE';

                var matchList = JSON.parse(localStorage.getItem("matchList")) || MATCH_LIST;

                $rows.each(function(i){
                    var $row = $(this),
                        $cols = [];

                    //Job Title
                    var job_link = $row.find('h3').find('a.dice-btn-link').attr('href');
                    var jobTitle = $row.find('h3').find('a.dice-btn-link').attr('title');
                    var job_title = '=HYPERLINK("'+ job_link +'", "' + jobTitle + '")';
                    $cols.push(job_title.replace(/"/g, '""'));
                    //Location
                    $cols.push($($row.find('li.location')[$row.find('li.location').length-1]).text().trim().replace(/"/g, '""'));
                    //Posted Time
                    $cols.push($row.find('li.posted').text().trim().replace(/"/g, '""'));
                    //Company
                    var company_link = $row.find('li.employer').find('a.dice-btn-link').attr('href');
                    var company = '=HYPERLINK("'+ company_link +'", "' + $row.find('li.employer').find('span.hidden-xs').text().trim() + '")';
                    $cols.push(company.replace(/"/g, '""'));
                    //Description
                    $cols.push($row.find('.shortdesc').text().trim().replace(/"/g, '""'));
                    //Job link
                    $cols.push(job_link.replace(/"/g, '""'));
                    //Company link
                    $cols.push(company_link.replace(/"/g, '""'));
                    //JOB_TYPE
                    var JOB_TYPE = "";
                    if($row.hasClass('featured-job')) {
                        JOB_TYPE = "Featured";
                    } else if($row.hasClass('bold-highlight')) {
                        JOB_TYPE = "Highlight";
                    }
                    $cols.push(JOB_TYPE.replace(/"/g, '""'));

                    //Match job_title
                    var match = '';
                    var point = 0;
                    jQuery.each(matchList, function(index, value) {
                        if(jobTitle.toLowerCase().indexOf(value.match.toLowerCase()) > -1) {
                            match += value.match + ', ';
                            point += parseInt(value.point, 10);
                        }
                    });
                    $cols.push(match.replace(/"/g, '""'));
                    $cols.push(point);

                    //Priority
                    var priority = ""
                    if(point >= PRIORITY.PRIORITY_VERY_HIGH) {
                        priority = "VERY HIGH";
                    } else if(point >= PRIORITY.PRIORITY_HIGH) {
                        priority = "HIGH";
                    } else if(point >= PRIORITY.PRIORITY_MEDIUM) {
                        priority = "MEDIUM";
                    } else if(point >= PRIORITY.PRIORITY_LOW) {
                        priority = "LOW";
                    } else if(point < 0) {
                        priority = "NEGATIVE";
                    }
                    $cols.push(priority);

                    csv += rowDelim + $cols.join(colDelim);
                });


                var captureData = JSON.parse(localStorage.getItem("captureData")) || {},
                    page = jQuery(response.dom).find('#dice_paging_top').find('li.active>a').text();

                captureData["page_"+page] = {
                    page: page, 
                    csv: csv
                };
                localStorage.setItem("captureData", JSON.stringify(captureData));
                info();


                // Data URI
                //csv = '"' + csv + '"';
                //var csvData = 'data:application/csv;charset=utf-8,' + encodeURIComponent(csv);

                //DOWNLOAD Link
                /*jQuery('#aDownload').attr({
                    'download': 'export.csv',
                        'href': csvData,
                        'target': '_blank'
                }).show();*/

              }
            }  
          });
        });

    }, false);
}, false);
