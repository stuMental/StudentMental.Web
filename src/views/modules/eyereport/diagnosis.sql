-- 班级维度
SELECT
	dt,
	course_name,
	study_level,
	grade_level 
FROM
	class_status_grade_study_daily 
WHERE
	college_name = #{college_name} 
	AND grade_name = #{grade_name} 
	AND class_name = #{class_name} 
	AND course_name = #{course_name}
	AND dt &gt;= #{dt}
	AND dt &lt;= date_add( #{dt}, INTERVAL  60 DAY ) 

-- 学生维度
SELECT
	course_name, grade_level, study_level
FROM student_mental_status_grade_study_daily
WHERE student_number = #{studentid} AND dt &gt;= #{date1} AND dt &lt;= #{date2}
ORDER BY course_name ASC;