document.addEventListener('DOMContentLoaded', function() {
    jQuery('#aDownload').hide();

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
                    rowDelim = '"\r\n"',
                    csv = 'JOB TITLE","LOCATION","POSTED_TIME","COMPANY","DESCRIPTION","JOB_HTML_LINK","COMPANY_LINK';

                $rows.each(function(i){
                    var $row = $(this),
                        $cols = [];

                    //Job Title
                    $cols.push($row.find('h3').text().trim().replace(/"/g, '""'));
                    //Location
                    $cols.push($row.find('li.location').text().trim().replace(/"/g, '""'));
                    //Posted Time
                    $cols.push($row.find('li.posted').text().trim().replace(/"/g, '""'));
                    //Company
                    $cols.push($row.find('li.employer').find('span.hidden-xs').text().trim().replace(/"/g, '""'));
                    //Description
                    $cols.push($row.find('.shortdesc').text().trim().replace(/"/g, '""'));
                    //Job link
                    $cols.push($row.find('h3').find('a.dice-btn-link').attr('href').replace(/"/g, '""'));
                    //Company link
                    $cols.push($row.find('li.employer').find('a.dice-btn-link').attr('href').replace(/"/g, '""'));

                    csv += rowDelim + $cols.join(colDelim);
                });

                    
                // Data URI
                csv = '"' + csv + '"';
                var csvData = 'data:application/csv;charset=utf-8,' + encodeURIComponent(csv);

                //DOWNLOAD Link
                jQuery('#aDownload').attr({
                    'download': 'export.csv',
                        'href': csvData,
                        'target': '_blank'
                }).show();

              }
            }  
          });
        });

    }, false);
}, false);
