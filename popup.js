document.addEventListener('DOMContentLoaded', function() {
    
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
        }
    };

    info();
    
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
                csv = 'JOB TITLE","LOCATION","POSTED_TIME","COMPANY","DESCRIPTION","JOB_HTML_LINK","COMPANY_LINK","JOB_TYPE';

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

                $rows.each(function(i){
                    var $row = $(this),
                        $cols = [];

                    //Job Title
                    var job_link = $row.find('h3').find('a.dice-btn-link').attr('href');
                    var job_title = '=HYPERLINK("'+ job_link +'", "' + $row.find('h3').text().trim() + '")';
                    $cols.push(job_title.replace(/"/g, '""'));
                    //Location
                    $cols.push($row.find('li.location').text().trim().replace(/"/g, '""'));
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
